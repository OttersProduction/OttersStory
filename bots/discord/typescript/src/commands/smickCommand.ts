import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class SmickCommand {
  private smickResponses = [
    "OMG <@%s> just smicked <@%s>, such savage what will be done????",
    "<@%s> just smicked the shit outta <@%s>",
    "<@%s> trying to smick <@%s>, but he to weak >_>",
    "<@%s> omg you just smicked <@%s>, why i thought you were friends",
    "<@%s> smicked <@%s>, such smick, much wow",
    "<@%s> smicked that 👋 <@%s>",
    "<@%s> smicked <@%s>, why.... i dont get it....",
    "<@%s> smicked <@%s>, what a smick",
  ];

  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const smickedUser = interaction.options.getUser("user", true);

    if (smickedUser.id === interaction.user.id) {
      await interaction.reply({
        content: "You can't smick yourself",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const randomResponse =
      this.smickResponses[
        Math.floor(Math.random() * this.smickResponses.length)
      ];
    const formattedResponse = randomResponse
      .replace("%s", interaction.user.id)
      .replace("%s", smickedUser.id);

    await interaction.reply({
      content: formattedResponse,
    });
  }
}
