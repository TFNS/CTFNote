import { ActivityType, Client } from "discord.js";

import { Commands } from "../commands";
import interactionCreate from "./interactionCreate";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    client.user?.setPresence({
      activities: [{ name: "CTFs", type: ActivityType.Playing }],
    });

    client.user?.setAvatar("src/discord/boticon.png");

    await client.application.commands.set(Commands);
    interactionCreate(client);

    console.log(`${client.user.username} bot is online`);
  });
};
