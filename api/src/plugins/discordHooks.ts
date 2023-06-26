import { Build, Context } from "postgraphile";
import { SchemaBuilder } from "graphile-build";
import {
  CategoryChannel,
  ChannelType,
  Guild,
  GuildBasedChannel,
  MessageCreateOptions,
  MessagePayload,
  TextChannel,
} from "discord.js";
import {
  getAllCtfsFromDatabase,
  getCtfFromDatabase,
  getNameFromUserId,
} from "../discord/database/ctfs";
import { getDiscordGuild, usingDiscordBot } from "../discord";
import { changeDiscordUserRoleForCTF } from "../discord/commands/linkUser";
import { getDiscordIdFromUserId } from "../discord/database/users";
import { getTaskFromId } from "../discord/database/tasks";
import { sendMessageToChannel } from "../discord/utils/messages";
import { TaskInput, createChannelForNewTask } from "../discord/utils/channels";

export async function convertToUsernameFormat(userId: bigint | string) {
  // this is actually the Discord ID and not a CTFNote userId
  if (typeof userId === "string") {
    // but if somehow it's not, just return it
    if (isNaN(parseInt(userId))) return userId;
    return `<@${userId}>`;
  }

  const name = await getNameFromUserId(userId);
  if (name == null) return name;

  const discordId = await getDiscordIdFromUserId(userId);
  if (discordId == null) return name;

  const guild = getDiscordGuild();
  if (guild == null) return name;

  const member = await guild.members.fetch({ user: discordId });
  if (member == null) return name;

  const discordName = member.displayName;

  if (discordName.toLowerCase() !== name.toLowerCase()) {
    return `<@${discordId}> (${name})`;
  } else {
    return `<@${discordId}>`;
  }
}

export async function handleTaskSolved(id: bigint, userId: bigint | string) {
  const task = await getTaskFromId(id);
  if (task == null) return;

  return sendMessageFromTaskId(
    id,
    `${task.title} is solved by ${await convertToUsernameFormat(userId)}!`
  )
    .then(async (channel) => {
      if (channel != null) {
        return channel.setName(`solved-${task.title}`);
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
    fieldContext.scope.fieldName !== "stopWorkingOn" &&
    fieldContext.scope.fieldName !== "addTagsForTask" &&
    fieldContext.scope.fieldName !== "updateCtf" &&
    fieldContext.scope.fieldName !== "createInvitation" &&
    fieldContext.scope.fieldName !== "deleteInvitation" &&
    fieldContext.scope.fieldName !== "resetDiscordId" &&
    fieldContext.scope.fieldName !== "deleteCtf"
  ) {
    return null;
  }

  const handleDiscordMutationAfter = async (
    input: any,
    args: any,
    context: any
  ) => {
    const guild = getDiscordGuild();
    if (guild === null) return input;

    //add challenges to the ctf channel discord
    if (fieldContext.scope.fieldName === "createTask") {
      const task = args.input as TaskInput;
      createChannelForNewTask(guild, task, true);
    }
    if (fieldContext.scope.fieldName === "deleteTask") {
      const task = await getTaskFromId(args.input.id);
      if (task == null) return input;

      const channel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText && channel.topic === task.title
      ) as CategoryChannel | undefined;

      if (channel === undefined) return input;

      channel
        .setName(`${task.title}-deleted`)
        .catch((err) =>
          console.error("Failed to mark channel as deleted.", err)
        );
    }

    // handle task (un)solved
    if (
      fieldContext.scope.fieldName === "updateTask" &&
      args.input.id != null
    ) {
      const task = await getTaskFromId(args.input.id);
      if (task == null) return input;

      let title = task.title;
      if (args.input.patch.title != null) {
        title = args.input.patch.title;
      }

      if (args.input.patch.flag != null) {
        if (args.input.patch.flag !== "") {
          const userId = context.jwtClaims.user_id;
          handleTaskSolved(args.input.id, userId);
        } else {
          const task = await getTaskFromId(args.input.id);
          if (task == null) return input;

          const channel = guild?.channels.cache.find(
            (channel) =>
              channel.type === ChannelType.GuildText &&
              channel.topic === task.title
          ) as TextChannel | undefined;

          if (channel == null) return input;

          channel
            .setName(`${task.title}`)
            .catch((err) =>
              console.error("Failed to mark channel as unsolved.", err)
            );
        }
      }

      // handle task title change
      if (
        args.input.patch.title != null &&
        args.input.patch.title != task.title
      ) {
        const channel = guild?.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel.topic === task.title
        ) as TextChannel | undefined;

        if (channel == null) return input;
        channel
          .edit({
            name: title,
            topic: title,
          })
          .catch((err) => console.error("Failed to rename channel.", err));
      }

      // handle task description change
      if (
        args.input.patch.description != null &&
        args.input.patch.description !== task.description
      ) {
        sendMessageFromTaskId(
          task.id,
          `Description changed:\n${args.input.patch.description}`
        ).catch((err) => {
          console.error("Failed sending description change notification.", err);
        });
      }
    }

    if (fieldContext.scope.fieldName === "startWorkingOn") {
      //send a message to the channel that the user started working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;
      sendStartWorkingOnMessage(userId, taskId).catch((err) => {
        console.error("Failed sending 'started working on' notification.", err);
      });
    }
    if (fieldContext.scope.fieldName === "stopWorkingOn") {
      //send a message to the channel that the user stopped working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;

      sendStopWorkingOnMessage(userId, taskId).catch((err) => {
        console.error("Failed sending 'stopped working on' notification.", err);
      });
    }
    if (fieldContext.scope.fieldName === "createInvitation") {
      handeInvitation(
        args.input.invitation.ctfId,
        args.input.invitation.profileId,
        "add"
      ).catch((err) => {
        console.error("Failed to create invitation.", err);
      });
    }

    if (fieldContext.scope.fieldName === "deleteInvitation") {
      handeInvitation(args.input.ctfId, args.input.profileId, "remove").catch(
        (err) => {
          console.error("Failed to delete invitation.", err);
        }
      );
    }

    return input;
  };

  const handleDiscordMutationBefore = async (
    input: any,
    args: any,
    context: any
  ) => {
    const guild = getDiscordGuild();
    if (guild === null) return input;
    if (fieldContext.scope.fieldName === "updateCtf") {
      handleUpdateCtf(args, guild).catch((err) => {
        console.error("Failed to update ctf.", err);
      });
    }

    if (fieldContext.scope.fieldName === "deleteCtf") {
      handleDeleteCtf(args.input.id, guild).catch((err) => {
        console.error("Failed to delete ctf.", err);
      });
    }

    if (fieldContext.scope.fieldName === "resetDiscordId") {
      // we need to use the await here to prevent a race condition
      // between deleting the discord id and retrieving the discord id (to remove the roles)
      await handleResetDiscordId(context.jwtClaims.user_id).catch((err) => {
        console.error("Failed to reset discord id.", err);
      });
    }

    return input;
  };

  return {
    before: [
      {
        priority: 500,
        callback: handleDiscordMutationBefore,
      },
    ],
    after: [
      {
        priority: 500,
        callback: handleDiscordMutationAfter,
      },
    ],
    error: [],
  };
};

export async function sendStartWorkingOnMessage(
  userId: bigint,
  taskId: bigint
) {
  return sendMessageFromTaskId(
    taskId,
    `${await convertToUsernameFormat(userId)} is working on this task!`
  ).catch((err) => {
    console.error("Failed sending 'working on' notification.", err);
  });
}

export async function sendStopWorkingOnMessage(userId: bigint, taskId: bigint) {
  return sendMessageFromTaskId(
    taskId,
    `${await convertToUsernameFormat(userId)} stopped working on this task!`
  ).catch((err) => {
    console.error("Failed sending 'stopped working on' notification.", err);
  });
}

async function handleDeleteCtf(ctfId: any, guild: Guild) {
  const ctf = await getCtfFromDatabase(ctfId);
  if (ctf == null) return;

  const categoryChannels = guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      channel.name.startsWith(ctf.title)
  );

  categoryChannels.map((categoryChannel) => {
    guild?.channels.cache.map((channel) => {
      if (
        channel.type === ChannelType.GuildVoice &&
        channel.parentId === categoryChannel.id
      ) {
        return channel.delete();
      }
    });

    guild?.channels.cache.map(async (channel) => {
      if (
        channel.type === ChannelType.GuildText &&
        channel.parentId === categoryChannel.id
      ) {
        await channel.delete();
      }
    });

    categoryChannel.delete();
  });

  guild.roles.cache.map((role) => {
    if (role.name === ctf.title) {
      return role.delete();
    }
  });
}

async function handleResetDiscordId(userId: bigint) {
  const allCtfs = await getAllCtfsFromDatabase();
  await changeDiscordUserRoleForCTF(userId, allCtfs, "remove");
}

async function handeInvitation(
  ctfId: bigint,
  profileId: bigint,
  operation: "add" | "remove"
) {
  const ctf = await getCtfFromDatabase(ctfId);
  if (ctf == null) return;
  await changeDiscordUserRoleForCTF(profileId, ctf, operation);
}

async function handleUpdateCtf(args: any, guild: Guild) {
  const ctf = await getCtfFromDatabase(args.input.id);
  if (ctf == null) return;

  const categoryChannel = guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory && channel.name === ctf.title
  ) as CategoryChannel | undefined;

  if (categoryChannel != null) {
    categoryChannel.setName(args.input.patch.title).catch((err) => {
      console.error("Failed updating category.", err);
    });
  }

  const role = guild?.roles.cache.find((role) => role.name === ctf.title);
  role?.setName(args.input.patch.title).catch((err) => {
    console.error("Failed updating role.", err);
  });
}

async function sendMessageFromTaskId(
  id: bigint,
  message: string
): Promise<GuildBasedChannel | null> {
  const task = await getTaskFromId(id);
  if (task == null) return null;

  const ctf = await getCtfFromDatabase(task.ctfId);
  if (ctf == null) return null;

  const guild = getDiscordGuild();

  if (guild === null) {
    console.error("Guild not found");
    return null;
  }

  const channelsArray = Array.from(guild.channels.cache.values());
  for (const channel of channelsArray) {
    if (
      channel.type === ChannelType.GuildText &&
      channel.topic === task.title &&
      channel.parent?.name === ctf.title
    ) {
      sendMessageToChannel(channel, message);
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
