import {
  ActionRowBuilder,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../interfaces/command";
import {
  getCtfFromDatabase,
  getCTFNamesFromDatabase,
} from "../../database/ctfs";
import {
  createChannelForTaskInCtf,
  createChannelsAndRolesForCtf,
  getChannelCategoriesForCtf,
} from "../channels";
import { DiscordInputInteraction } from "../../interfaces/interaction";
import { getChallengesFromDatabase } from "../../database/tasks";

const customId = "create-ctf-interaction";

export const HandleCreateCtfInteraction: DiscordInputInteraction = {
  customId: customId,
  handle: async (client: Client, interaction: StringSelectMenuInteraction) => {
    const ctfName = interaction.values[0];
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
  },
};

async function createCtfLogic(client: Client, interaction: CommandInteraction) {
  let ctfNames = await getCTFNamesFromDatabase();
  const ctfNamesMessage = `Create one of the following CTFs`;

  if (!ctfNames || ctfNames.length === 0) {
    await interaction.editReply({
      content: "No CTFs found!",
    });
    return;
  }

  const guild = interaction.guild;
  if (guild == null) return;

  ctfNames = ctfNames.filter(
    (ctfName) => getChannelCategoriesForCtf(guild, ctfName).size === 0
  );

  if (ctfNames.length === 0) {
    await interaction.editReply({
      content: "All CTFs have already been created!",
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

  // Create the action row with the button components
  const actionRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  await interaction.editReply({
    content: ctfNamesMessage,
    components: [actionRow],
  });
}

export const CreateCtf: Command = {
  name: "create",
  description: "Creates the channels and roles for a CTF",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  run: async (client, interaction) => {
    return createCtfLogic(client, interaction).catch((e) => {
      console.error("Error during create ctf logic: ", e);
    });
  },
};
