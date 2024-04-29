import { Client, CommandInteraction, Interaction } from "discord.js";
import { Commands } from "../commands";
import { getCtfFromDatabase } from "../database/ctfs";
import { getChallengesFromDatabase } from "../database/tasks";
import {
  createChannelForTaskInCtf,
  createChannelsAndRolesForCtf,
} from "../utils/channels";
import { handleDeleteInteraction } from "../commands/deleteCtf";
import { handleArchiveInteraction } from "../commands/archiveCtf";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    //check if it is a button interaction
    if (interaction.isButton()) {
      //create the ctf channels and roles
      if (interaction.customId.startsWith("create-ctf-button-")) {
        const ctfName = interaction.customId.replace("create-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Creating the CTF channels and roles for ${ctfName}`,
          components: [],
        });

        const guild = interaction.guild;
        if (guild == null) return;

        // assign roles to users already having access to the ctf
        const ctf = await getCtfFromDatabase(ctfName);
        if (ctf == null) return;

        await createChannelsAndRolesForCtf(guild, ctf);

        // create for every challenge a channel
        const challenges = await getChallengesFromDatabase(ctf.id);

        for (const challenge of challenges) {
          await createChannelForTaskInCtf(guild, challenge, ctf);
        }

        await interaction.editReply({
          content: `Created the CTF channels and roles for ${ctfName}`,
          components: [],
        });
      } else if (interaction.customId.startsWith("archive-ctf-button-")) {
        const ctfName = interaction.customId.replace("archive-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Archiving the CTF channels and roles for ${ctfName}`,
          components: [],
        });
        await handleArchiveInteraction(interaction, ctfName);

        await interaction.editReply({
          content: `Archived the CTF channels and roles for ${ctfName}`,
          components: [],
        });
      } else if (interaction.customId.startsWith("delete-ctf-button-")) {
        const ctfName = interaction.customId.replace("delete-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Deleting the CTF channels and roles for ${ctfName}`,
          components: [],
        });

        const done = await handleDeleteInteraction(interaction, ctfName);
        if (!done) {
          await interaction.editReply({
            content: `I insist that you create an \`/archive\` first!`,
          });
        } else {
          try {
            await interaction.editReply({
              content: `Deleted the CTF channels and roles for ${ctfName}`,
              components: [],
            });
          } catch (error) {
            console.debug(
              "Failed to update message that CTF was deleted. Probably the command was triggered in a channel that got deleted by the /delete command.",
              error
            );
          }
        }
      }
    }

    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
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
