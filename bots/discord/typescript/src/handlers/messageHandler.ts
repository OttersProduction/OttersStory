import { Message } from "discord.js";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";
import { TTS } from "@/utils/tts";
import { StreamType, AudioPlayerStatus } from "@discordjs/voice";

interface QueuedTTSItem {
  content: string;
  guildId: string;
}

export class MessageHandler {
  private ttsQueues: Map<string, QueuedTTSItem[]> = new Map();
  private processingQueues: Map<string, boolean> = new Map();

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
        const guildId = message.guild.id;
        
        // Add to queue
        this.enqueueTTS(guildId, message.content);
        
        // Process queue
        this.processQueue(guildId, utils, voiceConnectionManager, tts);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  private enqueueTTS(guildId: string, content: string): void {
    if (!this.ttsQueues.has(guildId)) {
      this.ttsQueues.set(guildId, []);
    }
    
    const queue = this.ttsQueues.get(guildId)!;
    queue.push({ content, guildId });
  }

  private async processQueue(
    guildId: string,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager,
    tts: TTS
  ): Promise<void> {
    // If already processing this queue, don't start another process
    if (this.processingQueues.get(guildId)) {
      return;
    }

    this.processingQueues.set(guildId, true);

    try {
      while (true) {
        const queue = this.ttsQueues.get(guildId);
        if (!queue || queue.length === 0) {
          break;
        }

        // Check if audio is currently playing
        const status = voiceConnectionManager.getAudioPlayerStatus(guildId);
        const isPlaying = status === AudioPlayerStatus.Playing || 
                         status === AudioPlayerStatus.Buffering;

        if (isPlaying) {
          // Wait for current audio to finish
          await this.waitForAudioToFinish(guildId, voiceConnectionManager);
        }

        // Get next item from queue
        const item = queue.shift();
        if (!item) {
          break;
        }

        // Generate and play TTS
        try {
          const stream = await tts.play(item.content);
          if (stream) {
            await voiceConnectionManager.playStream(guildId, stream, {
              inputType: StreamType.Arbitrary,
            });
            
            // Wait for this audio to finish before processing next
            await this.waitForAudioToFinish(guildId, voiceConnectionManager);
          }
        } catch (error) {
          console.error(`[MessageHandler] Error playing TTS for guild ${guildId}:`, error);
        }
      }
    } finally {
      this.processingQueues.set(guildId, false);
    }
  }

  private async waitForAudioToFinish(
    guildId: string,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        const status = voiceConnectionManager.getAudioPlayerStatus(guildId);
        if (status === AudioPlayerStatus.Idle || status === null) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100); // Check every 100ms

      // Timeout after 5 minutes to prevent infinite waiting
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5 * 60 * 1000);
    });
  }
}
