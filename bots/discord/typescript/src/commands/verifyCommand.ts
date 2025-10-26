import {
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class VerifyCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const popularTimezones = Utils.getPopularTimezones();

    const timezoneOptions = popularTimezones.map((tz) => ({
      label: Utils.getTimezoneDisplayName(tz),
      value: tz,
      description: tz,
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`timezone_select_${interaction.user.id}`)
      .setPlaceholder("Select your timezone")
      .addOptions(timezoneOptions);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu
    );

    await interaction.reply({
      content: "Please select your timezone:",
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}
