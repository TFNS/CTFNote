import { Client, CommandInteraction, Interaction } from "discord.js";
import { Commands } from "../commands";
import { createTask, getCtfFromDatabase } from "../database/ctfs";
import { getChallengesFromDatabase } from "../database/tasks";
import {
  createChannelForTaskInCtf,
  createChannelsAndRolesForCtf,
  getChannelCategoriesForCtf,
} from "../utils/channels";
import {
  convertMessagesToPadFormat,
  createPadWithoutLimit,
  getMessagesOfCategories,
} from "../utils/messages";
import { handleDeleteCtf } from "../../plugins/discordHooks";

async function handleArchiveInteraction(
  interaction: Interaction,
  ctfName: string
) {
  const guild = interaction.guild;
  if (guild == null) return;

  const ctf = await getCtfFromDatabase(ctfName);
  if (ctf == null) return null;

  const categories = getChannelCategoriesForCtf(guild, ctf.title);
  if (categories.size === 0) return;

  const messages = await getMessagesOfCategories(
    Array.from(categories.values())
  );

  await handleDeleteCtf(ctfName, guild);

  const padMessages = await convertMessagesToPadFormat(messages);

  const padUrl = await createPadWithoutLimit(padMessages, ctf.title);

  await createTask(
    `${ctf.title} Discord archive`,
    `Discord archive of ${ctf.title}`,
    "",
    padUrl,
    ctf.id
  );
}

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
      } else if (interaction.customId.startsWith("archive-ctf-button-")) {
        const ctfName = interaction.customId.replace("archive-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Archiving the CTF channels and roles for ${ctfName}`,
          components: [],
        });

        await handleArchiveInteraction(interaction, ctfName);
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
