import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../command";
import { getCTFNamesFromDatabase } from "../database/ctfs";
import { getChannelCategoriesForCtf } from "../utils/channels";

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
