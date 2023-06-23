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

async function archiveCtfLogic(
  client: Client,
  interaction: CommandInteraction
) {
  // Get current CTFs from the discord categorys
  const ctfName = await getAllCtfsFromDatabase();
  const ctfsInDiscord = interaction.guild?.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      ctfName.includes(channel.name)
  );

  if (!ctfsInDiscord || ctfsInDiscord.size === 0) {
    await interaction.editReply({
      content: "No CTFs found!",
    });
    return;
  }

  const buttons: ButtonBuilder[] = [];

  ctfsInDiscord.forEach((ctf) => {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`archive-ctf-button-${ctf.name}`)
        .setLabel(ctf.name)
        .setStyle(ButtonStyle.Success)
    );
  });

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
