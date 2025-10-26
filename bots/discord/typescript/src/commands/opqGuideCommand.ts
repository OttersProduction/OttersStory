import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class OPQGuideCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle("Orbis pq guide")
      .setDescription("Guide for the Orbis pq")
      .setURL("https://royals.ms/forum/threads/orbis-pq-guide.174277/")
      .setColor(0x58bcff)
      .setThumbnail(
        "https://bc.hidden-street.net/sites/global.hidden-street.net/files/npcs/npc_2013000.png"
      )
      .setImage("https://i.imgur.com/EUtYsf3.png")
      .addFields(
        {
          name: "Stage 1 (Entrance)",
          value:
            "Break the clouds and collect 20 pieces, drop in the middle of the room on the platform",
          inline: true,
        },
        {
          name: "Stage 2 (Lobby)",
          value:
            "Reach top of each platform to break boxes which drops records. after getting the correct record, drop it at the player. see https://i.imgur.com/OKkxinP.png",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false,
        },
        {
          name: "Stage 3 (Sealed room)",
          value:
            "5 members need to find the correct combination by standing on the correct platform. see http://i.imgur.com/tSVhylv.png",
          inline: true,
        },
        {
          name: "Stage 4 (Lounge)",
          value: "Collect 40 rocks, 10 from each room",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false,
        },
        {
          name: "Stage 5 (Storage)",
          value:
            "Kill all Cellions, only 1 will spawn at a time. last Cellion drops a piece which need to talk to cloudy",
          inline: true,
        },
        {
          name: "Stage 6 (Walkway)",
          value: "Kill all the ghosts, need 30 pieces to continue.",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false,
        },
        {
          name: "Stage 7 (On the way up)",
          value:
            "Climb up by finding the correct path. spam attack the levers while the leader spam talk to the npc",
          inline: true,
        },
        {
          name: "Stage 8 (Restoring the Statue)",
          value:
            "Drops all the statue pieces on the correct spot completing the statue",
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: false,
        },
        {
          name: "Stage 9 (Boss stage)",
          value:
            "Find seeds and drop in the pots, find brown plant and kill it to spawn the boss. drop the boss seed at the pot that didnt grew",
        }
      );

    await interaction.reply({ embeds: [embed] });
  }
}
