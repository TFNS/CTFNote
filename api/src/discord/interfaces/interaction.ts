import { Client, StringSelectMenuInteraction } from "discord.js";

export interface DiscordInputInteraction {
  customId: string;
  handle: (
    client: Client,
    interaction: StringSelectMenuInteraction
  ) => Promise<void>;
}
