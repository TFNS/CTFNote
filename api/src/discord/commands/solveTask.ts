import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CategoryChannel,
  ChannelType,
  Client,
  CommandInteraction,
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
import { getUserByDiscordId } from "../database/users";

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

  const name = currentTaskChannel?.topic;
  if (name == null) return accessDenied(interaction);

  const task = await getTaskByCtfIdAndNameFromDatabase(ctfId, name);
  if (task.id == null) return accessDenied(interaction);

  const flag = interaction.options.get("flag", true).value as string;
  if (flag == null || flag == "") return accessDenied(interaction);

  const result = await setFlagForChallengeId(task.id, flag);
  if (result) {
    await interaction.editReply({
      content:
        motivationalSentences[
          Math.floor(Math.random() * motivationalSentences.length)
        ],
    });
    let userId: bigint | null | string = await getUserByDiscordId(
      interaction.user.id
    );
    if (userId == null) userId = interaction.user.id;
    await handleTaskSolved(task.id, userId).catch((e) => {
      console.error("Error while handling task solved: ", e);
    });
    return;
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
  run: async (client, interaction) => {
    return solveTaskLogic(client, interaction).catch((e) => {
      console.error("Error during solve task logic: ", e);
    });
  },
};

const motivationalSentences = [
  "Congratulations! You've conquered the challenge!",
  "Well done! Your determination paid off!",
  "Awesome job! Your skills are unstoppable!",
  "You're on fire! Keep up the great work!",
  "Incredible! You're a CTF champion!",
  "You did it! Success tastes so sweet!",
  "Bravo! Your expertise is unmatched!",
  "Amazing work! You're a true hacker!",
  "Impressive! You cracked the code!",
  "Hats off to you! Your talent shines through!",
  "Victory is yours! You're a force to be reckoned with!",
  "You've proven your mettle! Great job!",
  "Spectacular performance! Keep pushing the boundaries!",
  "Well played! You're a CTF superstar!",
  "You've got the skills! Keep aiming higher!",
  "Kudos to you! You're a CTF legend!",
  "Magnificent job! The challenge couldn't stand a chance!",
  "You're unstoppable! Keep that momentum going!",
  "Way to go! Your perseverance paid off!",
  "Outstanding! You've reached new heights!",
  "Fantastic work! Your dedication shines through!",
  "You're a true warrior! Celebrate your victory!",
  "Excellence personified! You're a CTF master!",
  "Incredible performance! Keep challenging yourself!",
  "You're on a roll! Don't stop now!",
  "Brilliant! The challenge didn't stand a chance!",
  "You're a problem-solving genius! Keep it up!",
  "Unbelievable! You cracked the toughest nut!",
  "You're a CTF prodigy! Keep honing your skills!",
  "Phenomenal work! Your talent knows no bounds!",
  "You're a game-changer! Keep raising the bar!",
  "Exceptional performance! The challenge bows to you!",
  "You're a CTF virtuoso! Keep pushing your limits!",
  "Outstanding achievement! You're unstoppable!",
  "Great job! Your brilliance is unmatched!",
  "You're a CTF superstar! Keep shining bright!",
  "You're an inspiration! Keep chasing your dreams!",
  "Well done! You're a CTF trailblazer!",
  "You're a true champion! Never stop challenging yourself!",
  "Congratulations on your triumph! You're exceptional!",
  "You're a CTF wizard! Keep casting your spells!",
  "Outstanding skills! The challenge was no match for you!",
  "You're an unstoppable force! Keep dominating!",
  "Hurray! You've conquered the challenge!",
  "You're a CTF legend in the making! Keep it up!",
  "Marvelous work! Your brilliance is unmatched!",
  "You're a true genius! The challenge bows to you!",
  "You're a CTF prodigy! Keep rocking the cyberworld!",
  "Phenomenal performance! You've set a new standard!",
  "Incredible job! You've left the challenge in the dust!",
  "You're a CTF mastermind! Keep solving the impossible!",
  "Astounding skills! You're a force to be reckoned with!",
  "Congratulations! Your victory is well deserved!",
  "You're a CTF phenomenon! Keep pushing the limits!",
];
