import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class HTPartyCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const dateInput = interaction.options.getString("date", true);

    try {
      const startTime = Utils.dateFromDayMonth(dateInput);
      const formattedTime = startTime
        .toISOString()
        .replace("T", " ")
        .substring(0, 16);

      const embed = new EmbedBuilder()
        .setTitle("Horntail Run")
        .setDescription(`Running at ${formattedTime} server time (UTC) <3`)
        .setURL("https://royals.ms/forum/threads/zancks-bossing-guide.196246/")
        .setColor(0x221111)
        .setThumbnail(
          "https://bc.hidden-street.net/sites/global.hidden-street.net/files/npcs/npc438.png"
        )
        .setImage(
          "https://media.maplestorywiki.net/yetidb/Mob_Horntail_%28Full_Body%29.png"
        )
        .addFields(
          {
            name: "Members needed: 6 minimum, no max)",
            value: `React with the following for your **role**:

> Attacker ⚔️
> Seduce Target 🌀
> SI / Bucc 🏴
> SE / Archer 🏹
> CR / Pally 🛡️
> HS / Bishop 🙏`,
          },
          {
            name: "**Ready Checklist**",
            value: `> 300~ All cure potions 🥛
> 1k~ HP/MP Potions 🧀
> 8~ Onyx Apples 🍎
> Dragon Elixirs 🐉`,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: false,
          },
          {
            name: "Summary",
            value: "Just have fun every one, which you best of luck <3",
          }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({
        content: "Invalid date format. Please use DD/MM HH:MM format.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
