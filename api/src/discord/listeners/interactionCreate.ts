import { Client, CommandInteraction, Interaction } from "discord.js";
import { Commands } from "../commands/commands";
import { Interactions } from "../interactions/interactions";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    //check if it is a button interaction
    if (interaction.isButton()) {
      await handleButtonInteraction(client, interaction);
    } else if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleButtonInteraction = async (
  client: Client,
  interaction: Interaction
): Promise<void> => {
  if (!interaction.isButton()) {
    return;
  }
  const handler = Interactions.find((i) =>
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
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  slashCommand.run(client, interaction);
};
