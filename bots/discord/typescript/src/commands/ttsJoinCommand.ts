import {
  ChatInputCommandInteraction,
  VoiceChannel,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class TTSJoinCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const member = interaction.member as GuildMember;

    // Check if user is in a voice channel
    if (!member.voice.channel) {
      await interaction.reply({
        content: "❌ You must be in a voice channel to use this command.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const voiceChannel = member.voice.channel as VoiceChannel;

    try {
      // Join the user's voice channel using the voice connection manager
      const connection = await voiceConnectionManager.joinChannel(
        interaction.guild!,
        voiceChannel
      );

      if (!connection) {
        throw new Error("Failed to join voice channel");
      }

      await interaction.reply({
        content: `✅ Joined voice channel: ${voiceChannel.name}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error joining voice channel:", error);
      await interaction.reply({
        content: "❌ An error occurred while joining the voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
