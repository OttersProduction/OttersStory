import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Message,
  VoiceState,
} from "discord.js";
import { config } from "dotenv";
import { Database } from "@/database/database";
import { CommandHandler } from "@/handlers/commandHandler";
import { InteractionHandler } from "@/handlers/interactionHandler";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";
import { MessageHandler } from "./handlers/messageHandler";
import { TTS } from "./utils/tts";

// Load environment variables
config();

class DiscordBot {
  private client: Client;
  private database: Database;
  private commandHandler: CommandHandler;
  private interactionHandler: InteractionHandler;
  private utils: Utils;
  private voiceConnectionManager: VoiceConnectionManager;
  private messageHandler: MessageHandler;
  private tts: TTS;
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers, // Required for role management and nickname setting
        GatewayIntentBits.MessageContent, // Required to read message content for TTS
      ],
    });

    this.database = new Database();
    this.tts = new TTS();
    this.utils = new Utils(this.client, this.database);
    this.commandHandler = new CommandHandler();
    this.messageHandler = new MessageHandler();
    this.voiceConnectionManager = new VoiceConnectionManager();
    this.interactionHandler = new InteractionHandler(
      this.database,
      this.utils,
      this.voiceConnectionManager
    );
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await this.database.init();
      console.log("Database initialized");

      // Setup event listeners
      this.setupEventListeners();

      // Login to Discord
      try {
        await this.client.login(process.env.DISCORD_TOKEN);
        console.log("Bot logged in successfully");
      } catch (loginError: any) {
        if (
          loginError.message &&
          loginError.message.includes("disallowed intents")
        ) {
          console.error(`
❌ Bot failed to start due to disallowed intents!

To fix this issue, you need to enable the following intents in your Discord Developer Portal:

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to the "Bot" section
4. Scroll down to "Privileged Gateway Intents"
5. Enable the following intents:
   ✅ Server Members Intent (required for role management and nickname setting)
   ✅ Message Content Intent (required to read message content for TTS)

After enabling these intents, restart the bot.

Current error: ${loginError.message}
          `);
        } else {
          console.error("Login error:", loginError);
        }
        throw loginError;
      }

      // Initialize utils with guild
      if (this.client.guilds.cache.size > 0) {
        const guildId = this.client.guilds.cache.first()!.id;
        await this.utils.init(guildId);
      }

      // Register slash commands
      await this.registerCommands();
    } catch (error) {
      console.error("Error starting bot:", error);
      process.exit(1);
    }
  }

  private setupEventListeners(): void {
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`Logged in as ${readyClient.user.tag}!`);
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      await this.interactionHandler.handle(interaction);
    });

    this.client.on(Events.MessageCreate, async (message) => {
      await this.messageHandler.handle(
        message,
        this.utils,
        this.voiceConnectionManager,
        this.tts
      );
    });

    this.client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      await this.handleVoiceStateUpdate(oldState, newState);
    });
  }

  private async handleVoiceStateUpdate(
    oldState: VoiceState,
    newState: VoiceState
  ): Promise<void> {
    try {
      // Delegate to the voice connection manager
      await this.voiceConnectionManager.handleVoiceStateUpdate(
        oldState,
        newState
      );
    } catch (error) {
      console.error("Error handling voice state update:", error);
    }
  }

  private async registerCommands(): Promise<void> {
    const commands = this.commandHandler.getCommands();

    try {
      console.log("Registering slash commands...");
      await this.client.application?.commands.set(commands);
      console.log("Slash commands registered successfully");
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  }

  public async stop(): Promise<void> {
    try {
      console.log("Removing slash commands...");
      await this.client.application?.commands.set([]);
      console.log("Slash commands removed");

      // Clean up voice connections
      await this.voiceConnectionManager.cleanup();

      await this.client.destroy();
      console.log("Bot stopped gracefully");
    } catch (error) {
      console.error("Error stopping bot:", error);
    }
  }
}

// Create and start the bot
const bot = new DiscordBot();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await bot.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await bot.stop();
  process.exit(0);
});

// Start the bot
bot.start().catch(console.error);
