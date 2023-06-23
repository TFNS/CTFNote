import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../command";
import { getCTFNamesFromDatabase } from "../database/ctfs";

async function createCtfLogic(client: Client, interaction: CommandInteraction) {
  const ctfNames = await getCTFNamesFromDatabase();
  const ctfNamesMessage = `Create one of the following CTFs`;

  if (!ctfNames || ctfNames.length === 0) {
    await interaction.editReply({
      content: "No CTFs found!",
    });
    return;
  }

  const categorys = interaction.guild?.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      ctfNames.includes(channel.name)
  );

  categorys?.forEach((category) => {
    if (ctfNames.includes(category.name)) {
      ctfNames.splice(ctfNames.indexOf(category.name), 1);
    }
  });

  if (ctfNames.length === 0) {
    await interaction.editReply({
      content: "All CTFs have already been created!",
    });
    return;
  }

  // Make a loop to create buttons for each CTF
  const buttons: any[] = [];
  for (let i = 0; i < ctfNames.length; i++) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`create-ctf-button-${ctfNames[i]}`)
        .setLabel(ctfNames[i])
        .setStyle(ButtonStyle.Success)
    );
  }

  // Create the action row with the button components
  const actionRow: any = new ActionRowBuilder().addComponents(buttons);

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
