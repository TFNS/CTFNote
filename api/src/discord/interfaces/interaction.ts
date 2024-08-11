import { ButtonInteraction, Client } from "discord.js";

export interface DiscordButtonInteraction {
  customId: string;
  handle: (client: Client, interaction: ButtonInteraction) => Promise<void>;
}
