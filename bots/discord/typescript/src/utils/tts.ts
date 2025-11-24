import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";

export class TTS {
  private elevenLabs: ElevenLabsClient;

  constructor() {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }

  /**
   * Generate TTS audio stream from text content
   * @param content - Text to convert to speech
   * @returns Readable stream of MP3 audio data, or undefined if error/empty
   */
  public async play(content: string): Promise<Readable | undefined> {
    try {

      if (!process.env.ELEVENLABS_VOICE_ID) {
        console.error("ELEVENLABS_VOICE_ID is not set");
        return undefined;
      }

      if (!content || content.length === 0) {
        return undefined;
      }

      // Generate audio using ElevenLabs Text-to-Speech API with turbo v2.5 model
      const audio = await this.elevenLabs.textToSpeech.convert(process.env.ELEVENLABS_VOICE_ID,  {
        modelId: "eleven_turbo_v2_5",
        outputFormat: "mp3_44100_128",
        text: content,
      });

      // Convert Web ReadableStream to Node.js Readable stream
      const stream = Readable.fromWeb(audio as any);

      // Handle stream errors
      stream.on("error", (error) => {
        console.error("[TTS] Stream error:", error);
      });

      return stream;
    } catch (error) {
      console.error("[TTS] Error generating audio:", error);
      return undefined;
    }
  }
}
