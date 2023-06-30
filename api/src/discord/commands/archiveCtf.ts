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
import { getAllCtfsFromDatabase } from "../database/ctfs";
import { getChannelCategoriesForCtf } from "../utils/channels";

async function archiveCtfLogic(
  client: Client,
  interaction: CommandInteraction
) {
  // Get current CTFs from the discord categorys
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

  const buttons: ButtonBuilder[] = [];
  for (let i = 0; i < ctfNames.length; i++) {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`archive-ctf-button-${ctfNames[i]}`)
        .setLabel(ctfNames[i])
        .setStyle(ButtonStyle.Success)
    );
  }

  const actionRow: any = new ActionRowBuilder().addComponents(buttons);

  await interaction.editReply({
    content: "Which CTF do you want to archive?",
    components: [actionRow],
  });
}

export const ArchiveCtf: Command = {
  name: "archive",
  description: "Archive the CTF messages!",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  run: async (client, interaction) => {
    return archiveCtfLogic(client, interaction).catch((e) => {
      console.error("Error during archive ctf logic: ", e);
    });
  },
};
