import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import config from "../config";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

export default function createDiscordClient(): Client {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ]
    });

    ready(client);
    interactionCreate(client);

    client.login(config.discord.token);
    client.user?.setActivity('Playing CTFs', { type: ActivityType.Competing });


    return client;

}

