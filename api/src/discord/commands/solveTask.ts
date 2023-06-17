import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  ChannelType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { Command } from "../command";
import {
  getCTFNamesFromDatabase,
  getCtfIdFromDatabase,
} from "../database/ctfs";
import {
  getTaskByCtfIdAndNameFromDatabase,
  setFlagForChallengeId,
} from "../database/tasks";
import { handleTaskSolved } from "../../plugins/discordHooks";

async function accessDenied(interaction: CommandInteraction) {
  await interaction.editReply({
    content: "You are not using a valid channel to solve the task",
  });
}

async function solveTaskLogic(client: Client, interaction: CommandInteraction) {
  const ctfNames = await getCTFNamesFromDatabase();

  const categoryChannel = (await interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      ctfNames.includes(channel.name)
  )) as CategoryChannel;
  if (categoryChannel == null) return accessDenied(interaction);

  const currentTaskChannel = (await interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.id === interaction.channelId &&
      channel.guildId === categoryChannel.guildId
  )) as TextChannel;

  const ctfId = await getCtfIdFromDatabase(categoryChannel.name);
  if (ctfId == null) return accessDenied(interaction);

  const topic = currentTaskChannel?.topic;
  if (topic == null) return accessDenied(interaction);

  const nameAndTagsSplitted = topic.split(", tags: ");

  if (nameAndTagsSplitted.length < 2) return accessDenied(interaction);
  const name = nameAndTagsSplitted[0];

  const task = await getTaskByCtfIdAndNameFromDatabase(ctfId, name);
  if (task.id == null) return accessDenied(interaction);

  const flag = interaction.options.get("flag", true).value as string;
  if (flag == null || flag == "") return accessDenied(interaction);

  const result = await setFlagForChallengeId(task.id, flag);
  if (result) {
    await interaction.editReply({
      content: "Congrats! Task successfully solved!",
    });
    return handleTaskSolved(task.id);
  } else {
    await interaction.editReply({
      content: "Task is already solved. Please change the flag in CTFNote.",
    });
  }
}

export const SolveTask: Command = {
  name: "solve",
  description: "Solve the task linked to this text channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "flag",
      required: true,
      description: "The flag to submit to CTFNote",
      type: ApplicationCommandOptionType.String,
      minLength: 1,
    },
  ],
  run: solveTaskLogic,
};
