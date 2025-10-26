import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} from "discord.js";
import { Database } from "@/database/database";
import { Utils } from "@/utils/utils";
import { VoiceConnectionManager } from "@/voice/voiceConnectionManager";

export class TimeCommand {
  public async execute(
    interaction: ChatInputCommandInteraction,
    database: Database,
    utils: Utils,
    voiceConnectionManager: VoiceConnectionManager
  ): Promise<void> {
    const targetUser = interaction.options.getUser("user");
    const user = targetUser || interaction.user;

    try {
      const userTimezone = await database.getTimezone(user.id);

      if (!userTimezone) {
        const nickname = user.displayName || user.username;
        await interaction.reply({
          content: `${nickname} doesn't have a timezone set, ${nickname} need to /verify`,
        });
        return;
      }

      // Create a date object in the user's timezone
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: userTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const nickname = user.displayName || user.username;
      await interaction.reply({
        content: `${nickname}'s current time is ${timeString}`,
      });
    } catch (error) {
      console.error("Error getting user time:", error);
      const nickname = user.displayName || user.username;
      await interaction.reply({
        content: `${nickname}'s timezone is invalid, ${nickname} need to reverify their timezone using /verify`,
      });
    }
  }

  public async handleModal(
    interaction: ModalSubmitInteraction,
    database: Database,
    utils: Utils
  ): Promise<void> {
    const ign = interaction.fields.getTextInputValue("ign");
    const parts = interaction.customId.split("_");
    const userId = parts[2];
    const timezone = parts[3];

    try {
      // Validate timezone
      const timezoneList = Utils.getPopularTimezones();
      if (!timezoneList.includes(timezone)) {
        await interaction.reply({
          content: "Invalid timezone selected. Please try again.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Save user data
      await database.upsertUser(userId, ign, timezone);

      // Handle role assignment
      const member = await interaction.guild?.members.fetch(userId);
      if (member) {
        const unverifiedRole = interaction.guild?.roles.cache.find(
          (role) => role.name === "unverified"
        );
        const babyOtterRole = interaction.guild?.roles.cache.find(
          (role) => role.name === "Baby Otter"
        );

        if (unverifiedRole && babyOtterRole) {
          const hasUnverifiedRole = member.roles.cache.has(unverifiedRole.id);

          if (hasUnverifiedRole) {
            await member.roles.add(babyOtterRole);
            await member.roles.remove(unverifiedRole);
          }
        }

        // Set nickname if not guild owner
        if (interaction.guild?.ownerId !== userId) {
          await member.setNickname(ign);
        }
      }

      await interaction.reply({
        content: "Thank you for verifying your ign and timezone",
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("Error handling verify modal:", error);
      await interaction.reply({
        content: "An error occurred while verifying. Please try again.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  public async handleInteraction(
    interaction: StringSelectMenuInteraction,
    database: Database,
    utils: Utils
  ): Promise<void> {
    const timezone = interaction.values[0];
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
      .setCustomId(`modals_verify_${userId}_${timezone}`)
      .setTitle("Verify - Enter IGN");

    const ignInput = new TextInputBuilder()
      .setCustomId("ign")
      .setLabel("IGN")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter your IGN")
      .setRequired(true)
      .setMaxLength(20)
      .setMinLength(2);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      ignInput
    );
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }
}
