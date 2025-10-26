import { ChatInputCommandInteraction } from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";
import OpenAI from "openai";

export class PCCommand {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const prompt = interaction.options.getString("prompt", true);

    try {
      await interaction.deferReply();

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides price estimates for MapleStory items based on the provided data. Be concise and helpful.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response =
        completion.choices[0]?.message?.content ||
        "Unable to generate response";

      await interaction.editReply({
        content: `**Price Check Result:**\n${response}`,
      });
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      await interaction.editReply({
        content:
          "Sorry, I encountered an error while processing your price check request.",
      });
    }
  }
}
