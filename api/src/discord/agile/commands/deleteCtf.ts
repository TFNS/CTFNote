import {
  ActionRowBuilder,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  Interaction,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../interfaces/command";
import {
  getAllCtfsFromDatabase,
  getCtfFromDatabase,
} from "../../database/ctfs";
import { getChannelCategoriesForCtf } from "../channels";
import { handleDeleteCtf } from "../hooks";
import { getTaskByCtfIdAndNameFromDatabase } from "../../database/tasks";
import { discordArchiveTaskName } from "../../utils/messages";
import { DiscordInputInteraction } from "../../interfaces/interaction";

const customId = "delete-ctf-interaction";

export async function handleDeleteInteraction(
  interaction: Interaction,
  ctfName: string
) {
  const guild = interaction.guild;
  if (guild == null) return;

  const ctf = await getCtfFromDatabase(ctfName);
  if (ctf == null) return null;

  const discordArchiveTask = await getTaskByCtfIdAndNameFromDatabase(
    ctf.id,
    `${ctfName} ${discordArchiveTaskName}`
  );

  if (discordArchiveTask == null) return false;

  await handleDeleteCtf(ctfName, guild);

  return true;
}

async function deleteCtfLogic(client: Client, interaction: CommandInteraction) {
  // Get current CTFs from the discord categories
  let ctfNames = await getAllCtfsFromDatabase();
  const guild = interaction.guild;
  if (guild == null) return;
  ctfNames = ctfNames.filter(
    (ctfName) => getChannelCategoriesForCtf(guild, ctfName).size !== 0
  );

  if (ctfNames.length === 0) {
    await interaction.editReply({
      content: "No CTFs found!",
    });
    return;
  }

  const options: StringSelectMenuOptionBuilder[] = [];
  for (let i = 0; i < ctfNames.length; i++) {
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(ctfNames[i])
        .setValue(ctfNames[i])
    );
  }

  const select = new StringSelectMenuBuilder();
  select
    .setCustomId(customId)
    .setPlaceholder("Choose the CTF")
    .addOptions(options);

  const actionRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  await interaction.editReply({
    content:
      "Which CTF do you want to **permanently** delete? **You must create an archive first!**",
    components: [actionRow],
  });
}

export const HandleDeleteCtfInteraction: DiscordInputInteraction = {
  customId: customId,
  handle: async (client: Client, interaction: StringSelectMenuInteraction) => {
    const ctfName = interaction.values[0];
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
  },
};

export const DeleteCtf: Command = {
  name: "delete",
  description: "Delete the channels and roles for a CTF. This is irreversible!",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  run: async (client, interaction) => {
    return deleteCtfLogic(client, interaction).catch((e) => {
      console.error("Error during delete ctf logic: ", e);
    });
  },
};
