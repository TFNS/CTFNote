import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
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
import { DiscordButtonInteraction } from "../../interfaces/interaction";
import { getChallengesFromDatabase } from "../../database/tasks";

export const HandleCreateCtfInteraction: DiscordButtonInteraction = {
  customId: "create-ctf-button",
  handle: async (client: Client, interaction: ButtonInteraction) => {
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

  // Make a loop to create buttons for each CTF
  const buttons: ButtonBuilder[] = [];
  for (let i = 0; i < ctfNames.length; i++) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`create-ctf-button-${ctfNames[i]}`)
        .setLabel(ctfNames[i])
        .setStyle(ButtonStyle.Success)
    );
  }

  // Create the action row with the button components
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttons
  );

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
