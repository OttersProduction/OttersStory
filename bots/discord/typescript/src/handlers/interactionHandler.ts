import {
  Interaction,
  InteractionType,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";
import { OPQGuideCommand } from "@/commands/opqGuideCommand";
import { HTPartyCommand } from "@/commands/htPartyCommand";
import { SuggestCommand } from "@/commands/suggestCommand";
import { PCCommand } from "@/commands/pcCommand";
import { VerifyCommand } from "@/commands/verifyCommand";
import { TimeCommand } from "@/commands/timeCommand";
import { SmickCommand } from "@/commands/smickCommand";
import { TTSSetupCommand } from "@/commands/ttsSetupCommand";
import { TTSJoinCommand } from "@/commands/ttsJoinCommand";
import { TTSStatusCommand } from "@/commands/ttsStatusCommand";
import { TTSLeaveCommand } from "@/commands/ttsLeaveCommand";

export class InteractionHandler {
  private database: Database;
  private utils: Utils;
  private voiceConnectionManager: VoiceConnectionManager;
  private commands: Map<string, any>;

  constructor(
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ) {
    this.database = database;
    this.utils = utils;
    this.voiceConnectionManager = voiceConnectionManager;
    this.commands = new Map();
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.commands.set("opq-guide", new OPQGuideCommand());
    this.commands.set("ht-pt", new HTPartyCommand());
    this.commands.set("suggest", new SuggestCommand());
    this.commands.set("pc", new PCCommand());
    this.commands.set("verify", new VerifyCommand());
    this.commands.set("time", new TimeCommand());
    this.commands.set("smick", new SmickCommand());
    this.commands.set("setup", new TTSSetupCommand());
    this.commands.set("join", new TTSJoinCommand());
    this.commands.set("tts-status", new TTSStatusCommand());
    this.commands.set("leave", new TTSLeaveCommand());
  }

  public async handle(interaction: Interaction): Promise<void> {
    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        await this.handleSlashCommand(
          interaction as ChatInputCommandInteraction
        );
      } else if (interaction.type === InteractionType.ModalSubmit) {
        await this.handleModalSubmit(interaction as ModalSubmitInteraction);
      } else if (interaction.type === InteractionType.MessageComponent) {
        await this.handleComponentInteraction(interaction);
      }
    } catch (error) {
      console.error("Error handling interaction:", error);

      if (interaction.isRepliable()) {
        try {
          await interaction.reply({
            content: "An error occurred while processing your request.",
            flags: MessageFlags.Ephemeral,
          });
        } catch (replyError) {
          console.error("Error sending error reply:", replyError);
        }
      }
    }
  }

  private async handleSlashCommand(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const commandName = interaction.commandName;
    const command = this.commands.get(commandName);

    if (command) {
      await command.execute(
        interaction,
        this.database,
        this.utils,
        this.voiceConnectionManager
      );
    } else {
      console.warn(`Unknown command: ${commandName}`);
      await interaction.reply({
        content: "Unknown command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  private async handleModalSubmit(
    interaction: ModalSubmitInteraction
  ): Promise<void> {
    const customId = interaction.customId;

    let handler: Promise<void> | undefined;
    if (customId.startsWith("modals_suggestion_")) {
      handler = this.commands
        .get("suggest")
        ?.handleModal(interaction, this.database, this.utils);
    } else if (customId.startsWith("modals_verify_")) {
      handler = this.commands
        .get("time")
        ?.handleModal(interaction, this.database, this.utils);
    }

    if (handler) {
      await handler;
    }
  }

  private async handleComponentInteraction(
    interaction: Interaction
  ): Promise<void> {
    if (interaction.isStringSelectMenu()) {
      const selectInteraction = interaction as StringSelectMenuInteraction;

      if (selectInteraction.customId.startsWith("timezone_select_")) {
        await this.commands
          .get("time")
          ?.handleInteraction(selectInteraction, this.database, this.utils);
      }
    }
  }
}
