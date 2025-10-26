import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";

export class TTS {
  private elevenLabs: ElevenLabsClient;

  constructor() {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }

  public async play(content: string): Promise<Readable | undefined> {
    try {
      if (content && content.length > 0) {
        const audio = await this.elevenLabs.textToSpeech.convert(
          "56AoDkrOh6qfVPDXZ7Pt",
          {
            text: content,
            modelId: "eleven_flash_v2_5",
            outputFormat: "mp3_44100_128",
          }
        );

        const reader = audio.getReader();
        const stream = new Readable({
          async read() {
            const { done, value } = await reader.read();
            if (done) {
              this.push(null);
            } else {
              this.push(value);
            }
          },
        });
        return stream;
      }
      return undefined;
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }
}
