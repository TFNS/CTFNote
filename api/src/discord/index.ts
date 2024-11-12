import { Client, GatewayIntentBits } from "discord.js";
import config from "../config";
import ready from "./listeners/ready";
import { connectToDatabase } from "../utils/database";

let client: Client | null = null;
export let usingDiscordBot = true;

export async function initDiscordBot() {
  getDiscordClient();

  const pgClient = await connectToDatabase();

  try {
    const query =
      "UPDATE ctfnote.settings SET discord_integration_enabled = $1";
    const values = [config.discord.use.toLowerCase() !== "false"];
    await pgClient.query(query, values);
  } catch (error) {
    console.error(
      "Failed to set discord_integration_enabled flag in the database:",
      error
    );
  } finally {
    pgClient.release();
  }
}

export function getDiscordClient(): Client | null {
  if (!usingDiscordBot) return null;
  if (config.discord.use.toLowerCase() === "false") {
    console.warn("Discord bot not enabled, skipping...");
    usingDiscordBot = false;
    return null;
  }
  if (!config.discord.token) throw new Error("Discord token not set");
  if (!config.discord.serverId) throw new Error("Discord serverId not set");

  if (!client) {
    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    ready(client);

    client
      .login(config.discord.token)
      .then(() => {
        usingDiscordBot = true;
      })
      .catch((error) => {
        console.error("Failed to log in to Discord:", error.code);
        client = null;
        usingDiscordBot = false;
      });
  }

  return client;
}

export function getDiscordGuild() {
  const discordClient = getDiscordClient();
  if (discordClient === null) return null;

  const guild = discordClient.guilds.resolve(config.discord.serverId);

  if (guild == null) {
    console.error("Guild not found, please check your environment variables!");
    return null;
  }

  return guild;
}
