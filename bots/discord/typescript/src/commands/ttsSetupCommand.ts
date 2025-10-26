import {
  ChatInputCommandInteraction,
  ChannelType,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class TTSSetupCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const channel = interaction.options.getChannel("channel", true);

    // Validate that the channel is a text channel
    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "❌ Please select a text channel for TTS setup.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      // Save the TTS channel configuration to database
      await database.setTTSChannel(interaction.guildId!, channel.id);

      await interaction.reply({
        content: `✅ TTS channel set to ${channel}. The bot will listen to messages in this channel for TTS.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error setting TTS channel:", error);
      await interaction.reply({
        content: "❌ An error occurred while setting up the TTS channel.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
