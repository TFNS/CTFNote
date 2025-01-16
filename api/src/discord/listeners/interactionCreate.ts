import { Client, CommandInteraction, Interaction } from "discord.js";
import {
  getChannelHandleStyleCommands,
  getChannelHandleStyleInteractions,
} from "../utils/channelStyle";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    //check if it is a button interaction
    if (interaction.isStringSelectMenu()) {
      await handleInputInteraction(client, interaction);
    } else if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleInputInteraction = async (
  client: Client,
  interaction: Interaction
): Promise<void> => {
  if (!interaction.isStringSelectMenu()) {
    return;
  }
  const handler = (await getChannelHandleStyleInteractions()).find((i) =>
    interaction.customId.startsWith(i.customId)
  );

  if (!handler) {
    await interaction.editReply({
      content: "An error has occurred",
    });
    return;
  }

  await handler.handle(client, interaction).catch((error) => {
    console.error("Error handling button interaction", error);
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = (await getChannelHandleStyleCommands()).find(
    (c) => c.name === interaction.commandName
  );
  if (!slashCommand) {
    await interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  slashCommand.run(client, interaction);
};
