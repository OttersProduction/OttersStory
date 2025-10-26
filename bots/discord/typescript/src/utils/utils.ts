import { Client, Guild, TextChannel } from "discord.js";
import { Database } from "@/database/database";

export class Utils {
  private client: Client;
  private database: Database;
  private pcPricesChannel: TextChannel | null = null;
  private suggestionChannel: TextChannel | null = null;
  private ttsChannel: TextChannel | null = null;
  constructor(client: Client, database: Database) {
    this.client = client;
    this.database = database;
  }

  public async init(guildId: string): Promise<void> {
    try {
      const ttsChannelId = await this.database.getTTSChannel(guildId);
      const guild = await this.client.guilds.fetch(guildId);
      const channels = await guild.channels.fetch();

      for (const channel of channels.values()) {
        if (channel instanceof TextChannel) {
          if (channel.name === "suggestions") {
            this.suggestionChannel = channel;
          }
          if (channel.name === "💰trade-pc") {
            this.pcPricesChannel = channel;
          }
          if (channel.id === ttsChannelId) {
            this.ttsChannel = channel;
          }
        }
      }

      console.log("Utils initialized with channels");
    } catch (error) {
      console.error("Error initializing utils:", error);
    }
  }

  public getPCPricesChannel(): TextChannel | null {
    return this.pcPricesChannel;
  }

  public getSuggestionChannel(): TextChannel | null {
    return this.suggestionChannel;
  }
  public getTTSChannel(): TextChannel | null {
    return this.ttsChannel;
  }

  public static dateFromDayMonth(date: string): Date {
    const layout = "DD/MM HH:mm";
    const parts = date.split(" ");
    const datePart = parts[0];
    const timePart = parts[1];

    const [day, month] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    const currentYear = new Date().getFullYear();
    return new Date(
      currentYear,
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  }

  public static getPopularTimezones(): string[] {
    return [
      "GMT",
      "Etc/GMT+1", // GMT-1
      "Etc/GMT+2", // GMT-2
      "Etc/GMT+3", // GMT-3
      "Etc/GMT+4", // GMT-4
      "Etc/GMT+5", // GMT-5
      "Etc/GMT+6", // GMT-6
      "Etc/GMT+7", // GMT-7
      "Etc/GMT+8", // GMT-8
      "Etc/GMT+9", // GMT-9
      "Etc/GMT+10", // GMT-10
      "Etc/GMT+11", // GMT-11
      "Etc/GMT+12", // GMT-12
      "Etc/GMT-1", // GMT+1
      "Etc/GMT-2", // GMT+2
      "Etc/GMT-3", // GMT+3
      "Etc/GMT-4", // GMT+4
      "Etc/GMT-5", // GMT+5
      "Etc/GMT-6", // GMT+6
      "Etc/GMT-7", // GMT+7
      "Etc/GMT-8", // GMT+8
      "Etc/GMT-9", // GMT+9
      "Etc/GMT-10", // GMT+10
      "Etc/GMT-11", // GMT+11
      "Etc/GMT-12", // GMT+12
    ];
  }

  public static getTimezoneDisplayName(tz: string): string {
    switch (tz) {
      // GMT Base
      case "GMT":
        return "GMT+0 (London, Dublin, Lisbon)";

      // GMT-1 to GMT-12 (West of GMT)
      case "Etc/GMT+1":
        return "GMT-1 (Azores, Cape Verde)";
      case "Etc/GMT+2":
        return "GMT-2 (Mid-Atlantic)";
      case "Etc/GMT+3":
        return "GMT-3 (Brazil, Argentina, Greenland)";
      case "Etc/GMT+4":
        return "GMT-4 (Caribbean, Venezuela)";
      case "Etc/GMT+5":
        return "GMT-5 (US Eastern, Canada, Peru)";
      case "Etc/GMT+6":
        return "GMT-6 (US Central, Mexico, Guatemala)";
      case "Etc/GMT+7":
        return "GMT-7 (US Mountain, Canada)";
      case "Etc/GMT+8":
        return "GMT-8 (US Pacific, Canada, Mexico)";
      case "Etc/GMT+9":
        return "GMT-9 (Alaska, French Polynesia)";
      case "Etc/GMT+10":
        return "GMT-10 (Hawaii, Cook Islands)";
      case "Etc/GMT+11":
        return "GMT-11 (American Samoa, Niue)";
      case "Etc/GMT+12":
        return "GMT-12 (Baker Island, Howland Island)";

      // GMT+1 to GMT+12 (East of GMT)
      case "Etc/GMT-1":
        return "GMT+1 (Central Europe, West Africa)";
      case "Etc/GMT-2":
        return "GMT+2 (Eastern Europe, South Africa, Israel)";
      case "Etc/GMT-3":
        return "GMT+3 (Moscow, East Africa, Middle East)";
      case "Etc/GMT-4":
        return "GMT+4 (UAE, Mauritius, Armenia)";
      case "Etc/GMT-5":
        return "GMT+5 (Pakistan, Uzbekistan, Maldives)";
      case "Etc/GMT-6":
        return "GMT+6 (Bangladesh, Kazakhstan, Bhutan)";
      case "Etc/GMT-7":
        return "GMT+7 (Thailand, Vietnam, Indonesia)";
      case "Etc/GMT-8":
        return "GMT+8 (China, Singapore, Philippines, Malaysia)";
      case "Etc/GMT-9":
        return "GMT+9 (Japan, South Korea, North Korea)";
      case "Etc/GMT-10":
        return "GMT+10 (Australia East, Papua New Guinea)";
      case "Etc/GMT-11":
        return "GMT+11 (Solomon Islands, New Caledonia)";
      case "Etc/GMT-12":
        return "GMT+12 (New Zealand, Fiji, Marshall Islands)";

      default:
        return tz;
    }
  }
}
