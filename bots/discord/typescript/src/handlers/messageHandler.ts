import { Message } from "discord.js";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";
import { TTS } from "@/utils/tts";
import { StreamType } from "@discordjs/voice";

export class MessageHandler {
  public async handle(
    message: Message,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager,
    tts: TTS
  ): Promise<void> {
    try {
      if (message.author.bot) return;
      if (!message.guild?.id) return;

      const ttsChannel = utils.getTTSChannel();
      if (ttsChannel && message.channel.id === ttsChannel.id) {
        const stream = await tts.play(message.content);
        if (stream) {
          await voiceConnectionManager.playStream(message.guild!.id, stream, {
            inputType: StreamType.Arbitrary,
          });
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }
}
