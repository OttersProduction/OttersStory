import {
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class SuggestCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId(`modals_suggestion_${interaction.user.id}`)
      .setTitle("Suggestion");

    const titleInput = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Find Base a wife")
      .setRequired(true)
      .setMaxLength(50)
      .setMinLength(5);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(2000);

    const titleRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      titleInput
    );
    const descriptionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

    modal.addComponents(titleRow, descriptionRow);

    await interaction.showModal(modal);
  }

  public async handleModal(
    interaction: ModalSubmitInteraction,
    database: Database,
    utils: Utils
  ): Promise<void> {
    const title = interaction.fields.getTextInputValue("title");
    const description = interaction.fields.getTextInputValue("description");
    const userId = interaction.customId.split("_")[2];

    await interaction.reply({
      content: "Thank you for taking your time to fill this suggestion",
      flags: MessageFlags.Ephemeral,
    });

    const suggestionChannel = utils.getSuggestionChannel();
    if (suggestionChannel) {
      await suggestionChannel.send({
        content: `**Suggestion: ${title}**\nAuthor: <@${userId}>\nDescription: ${description}`,
      });
    }
  }
}
