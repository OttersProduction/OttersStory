import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export class CommandHandler {
  public getCommands(): SlashCommandBuilder[] {
    const commands: any[] = [];

    // OPQ Guide command
    commands.push(
      new SlashCommandBuilder()
        .setName("opq-guide")
        .setDescription("Guide to Orbis pq")
    );

    // Horntail Party command
    commands.push(
      new SlashCommandBuilder()
        .setName("ht-pt")
        .setDescription("Arrange a party to kill horntail")
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription(
              "Date of the party assembly (DD/MM HH:MM) UTC/Server time"
            )
            .setRequired(true)
        )
    );

    // Suggest command
    commands.push(
      new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest a new feature or report a bug")
    );

    // Price Check command
    commands.push(
      new SlashCommandBuilder()
        .setName("pc")
        .setDescription("Get the price of a item")
        .addStringOption((option) =>
          option
            .setName("prompt")
            .setDescription("Prompt to get the price of a item")
            .setRequired(true)
        )
    );

    // Verify command
    commands.push(
      new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verify your ign and timezone")
    );

    // Time command
    commands.push(
      new SlashCommandBuilder()
        .setName("time")
        .setDescription("Get user current time")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to show its current time")
            .setRequired(false)
        )
    );

    // Smick command
    commands.push(
      new SlashCommandBuilder()
        .setName("smick")
        .setDescription("Smick a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to smick")
            .setRequired(true)
        )
    );

    // TTS Setup command
    commands.push(
      new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configure TTS channel")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Text channel to listen to for TTS")
            .setRequired(true)
        )
    );

    // TTS Join command
    commands.push(
      new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the user's voice channel for TTS")
    );

    // TTS Status command
    commands.push(
      new SlashCommandBuilder()
        .setName("tts-status")
        .setDescription("Check the current TTS channel configuration")
    );

    // TTS Leave command
    commands.push(
      new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave the current voice channel")
    );

    return commands;
  }
}
