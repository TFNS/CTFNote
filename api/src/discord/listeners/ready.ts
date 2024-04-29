import { ActivityType, Client } from "discord.js";

import { Commands } from "../commands";
import interactionCreate from "./interactionCreate";
import fs from "fs";
import config from "../../config";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    client.user?.setPresence({
      activities: [{ name: "CTFs", type: ActivityType.Playing }],
    });

    if (config.env !== "development") {
      client.user
        ?.setAvatar(
          fs.existsSync("src/discord/boticon.png")
            ? "src/discord/boticon.png"
            : "dist/discord/boticon.png"
        )
        .catch((err) => console.error("Failed to change avatar of bot.", err));
    }

    await client.application.commands.set(Commands);
    interactionCreate(client);

    console.log(`${client.user.username} bot is online`);
  });
};
