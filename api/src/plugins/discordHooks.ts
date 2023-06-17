import { Build, Context } from "postgraphile";
import { SchemaBuilder } from "graphile-build";
import {
  CategoryChannel,
  ChannelType,
  GuildBasedChannel,
  TextChannel,
} from "discord.js";
import {
  getCTFNameFromId,
  getNameFromUserId,
  getTaskFromId,
} from "../discord/database/ctfs";
import { getDiscordClient, usingDiscordBot } from "../discord";
import config from "../config";

export async function handleTaskSolved(id: bigint) {
  const task = await getTaskFromId(id);

  return sendMessageFromTaskId(id, `${task[0]} is solved!`)
    .then(async (channel) => {
      if (channel !== null) {
        return channel.setName(`${task[0]}-solved`);
      }
    })
    .catch((err) => {
      console.error("Failed sending solved notification.", err);
    });
}

const discordMutationHook = (_build: Build) => (fieldContext: Context<any>) => {
  const {
    scope: { isRootMutation },
  } = fieldContext;

  if (!isRootMutation) return null;

  if (!usingDiscordBot) return null;

  if (
    fieldContext.scope.fieldName !== "updateTask" &&
    fieldContext.scope.fieldName !== "createTask" &&
    fieldContext.scope.fieldName !== "deleteTask" &&
    fieldContext.scope.fieldName !== "startWorkingOn" &&
    fieldContext.scope.fieldName !== "stopWorkingOn"
  ) {
    return null;
  }

  const handleDiscordMutationLog = async (
    input: any,
    args: any,
    context: any
  ) => {
    const discordClient = getDiscordClient();
    if (discordClient === null) return null;

    const guild = discordClient.guilds.resolve(config.discord.serverId);

    if (guild === null) {
      console.error("Guild not found");
      return null;
    }

    //add challenges to the ctf channel discord
    if (fieldContext.scope.fieldName === "createTask") {
      const ctfName = await getCTFNameFromId(args.input.ctfId);

      const categoryChannel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildCategory && channel.name === ctfName
      ) as CategoryChannel | undefined;

      if (categoryChannel === undefined) {
        return null;
      }

      categoryChannel.guild.channels
        .create({
          name: `${args.input.title}`,
          type: ChannelType.GuildText,
          parent: categoryChannel.id,
          topic: `${args.input.title}, tags: ${args.input.category}`,
        })
        .catch((err) => {
          console.error("Failed creating category.", err);
        });

      //send message to the main channel that a new task has been created
      const mainChannel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText &&
          channel.name === "challenges-talk" &&
          channel.parentId === categoryChannel.id
      ) as TextChannel | undefined;

      if (mainChannel !== undefined) {
        mainChannel
          .send(
            `New task created: ${args.input.title} - ${args.input.category}`
          )
          .catch((err) => {
            console.error("Failed to send notification about a new task.", err);
          });
      }
    }
    if (fieldContext.scope.fieldName === "deleteTask") {
      const task = await getTaskFromId(args.input.id);

      const channel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText &&
          channel.name === `${task[0]}`
      ) as CategoryChannel | undefined;

      if (channel === undefined) return null;

      channel
        .setName(`${task[0]}-deleted`)
        .catch((err) =>
          console.error("Failed to mark channel as deleted.", err)
        );
    }

    if (
      fieldContext.scope.fieldName === "updateTask" &&
      args.input.patch.flag !== null &&
      args.input.id !== null
    ) {
      if (args.input.patch.flag !== "") {
        handleTaskSolved(args.input.id);
      }else{
        const task = await getTaskFromId(args.input.id);

        const channel = guild?.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel.name === `${task[0]}-solved`
        ) as CategoryChannel | undefined;

        if (channel === undefined) return null;

        channel
          .setName(`${task[0]}`)
          .catch((err) =>
            console.error("Failed to mark channel as unsolved.", err)
          );
      }
    }
    if (fieldContext.scope.fieldName === "startWorkingOn") {
      //send a message to the channel that the user started working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;

      getNameFromUserId(userId)
        .then((username) => {
          return sendMessageFromTaskId(
            taskId,
            `${username} is working on this task!`
          );
        })
        .catch((err) => {
          console.error("Failed sending 'working on' notification.", err);
        });
    }
    if (fieldContext.scope.fieldName === "stopWorkingOn") {
      //send a message to the channel that the user stopped working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;

      getNameFromUserId(userId)
        .then((username) => {
          return sendMessageFromTaskId(
            taskId,
            `${username} stopped working on this task!`
          );
        })
        .catch((err) => {
          console.error(
            "Failed sending 'stopped working on' notification.",
            err
          );
        });
    }

    return input;
  };

  return {
    before: [],
    after: [
      {
        priority: 500,
        callback: handleDiscordMutationLog,
      },
    ],
    error: [],
  };
};

async function sendMessageFromTaskId(
  id: bigint,
  message: string
): Promise<GuildBasedChannel | null> {
  const task = await getTaskFromId(id);
  const taskTitle = task[0].toLowerCase();
  const ctfName = await getCTFNameFromId(BigInt(task[2]));

  const discordClient = getDiscordClient();

  if (discordClient === null) return null;

  const guild = discordClient.guilds.resolve(config.discord.serverId);

  if (guild === null) {
    console.error("Guild not found");
    return null;
  }

  const channelsArray = Array.from(guild.channels.cache.values());

  for (const channel of channelsArray) {
    if (
      channel.type === ChannelType.GuildText &&
      channel.name === `${taskTitle}` &&
      channel.parent?.name === ctfName
    ) {
      channel.send(message);
      return channel;
    }
  }

  return null;
}

export default function (builder: SchemaBuilder): void {
  builder.hook("init", (_, build) => {
    build.addOperationHook(discordMutationHook(build));
    return _;
  });
}
