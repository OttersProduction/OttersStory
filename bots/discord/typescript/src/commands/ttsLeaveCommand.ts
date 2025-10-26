import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class TTSLeaveCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    try {
      // Check if the bot is connected to a voice channel
      if (!voiceConnectionManager.isConnected(interaction.guildId!)) {
        await interaction.reply({
          content: "❌ I'm not currently in a voice channel.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const connection = voiceConnectionManager.getConnection(
        interaction.guildId!
      );
      const voiceChannel = interaction.guild?.channels.cache.get(
        connection?.joinConfig.channelId!
      ) as any;

      // Leave the voice channel using the voice connection manager
      await voiceConnectionManager.leaveChannel(interaction.guild!);

      await interaction.reply({
        content: `✅ Left voice channel: ${voiceChannel?.name || "Unknown"}`,
        flags: MessageFlags.Ephemeral,
      });

      console.log(
        `[Manual Leave] Bot left voice channel: ${
          voiceChannel?.name || "Unknown"
        } (requested by ${interaction.user.tag})`
      );
    } catch (error) {
      console.error("Error leaving voice channel:", error);
      await interaction.reply({
        content: "❌ An error occurred while leaving the voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
