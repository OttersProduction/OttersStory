import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class TTSStatusCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    try {
      const ttsChannelId = await database.getTTSChannel(interaction.guildId!);

      if (ttsChannelId) {
        const channel = interaction.guild?.channels.cache.get(ttsChannelId);
        await interaction.reply({
          content: `✅ TTS is configured for channel: ${
            channel ? `<#${channel.id}>` : "Unknown Channel"
          }`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content:
            "❌ No TTS channel configured. Use `/setup` to configure one.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error("Error checking TTS status:", error);
      await interaction.reply({
        content: "❌ An error occurred while checking TTS status.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
