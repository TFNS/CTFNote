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
  getCTFNameFromId,
  getCtfById,
  getNameFromUserId,
  getTaskFromId,
} from "../discord/database/ctfs";
import { getDiscordGuild, usingDiscordBot } from "../discord";
import { changeDiscordUserRoleForCTF } from "../discord/commands/linkUser";
import { getDiscordIdFromUserId } from "../discord/database/users";

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

  return sendMessageFromTaskId(id, {
    content: `${task.title} is solved by ${await convertToUsernameFormat(
      userId
    )}!`,
    allowedMentions: {
      users: [],
    },
  })
    .then(async (channel) => {
      if (channel !== null) {
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
      const ctfName = await getCTFNameFromId(args.input.ctfId);

      const categoryChannel = guild?.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildCategory && channel.name === ctfName
      ) as CategoryChannel | undefined;

      if (categoryChannel === undefined) {
        return input;
      }

      categoryChannel.guild.channels
        .create({
          name: `${args.input.title}`,
          type: ChannelType.GuildText,
          parent: categoryChannel.id,
          topic: args.input.title,
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
          .send(`New task created: ${args.input.title}`)
          .catch((err) => {
            console.error("Failed to send notification about a new task.", err);
          });
      }
    }
    if (fieldContext.scope.fieldName === "deleteTask") {
      const task = await getTaskFromId(args.input.id);

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
      args.input.id !== null
    ) {
      const task = await getTaskFromId(args.input.id);
      let title = task.title;
      if (args.input.patch.title !== null) {
        title = args.input.patch.title;
      }

      if (args.input.patch.flag !== null) {
        if (args.input.patch.flag !== "") {
          const userId = context.jwtClaims.user_id;
          handleTaskSolved(args.input.id, userId);
        } else {
          const task = await getTaskFromId(args.input.id);

          const channel = guild?.channels.cache.find(
            (channel) =>
              channel.type === ChannelType.GuildText &&
              channel.topic === task.title
          ) as TextChannel | undefined;

          if (channel === undefined) return input;

          channel
            .setName(`${task.title}`)
            .catch((err) =>
              console.error("Failed to mark channel as unsolved.", err)
            );
        }
      }

      // handle task title change
      if (
        args.input.patch.title !== null &&
        args.input.patch.title !== task.title
      ) {
        const channel = guild?.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel.topic === task.title
        ) as TextChannel | undefined;

        if (channel === undefined) return input;
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
        sendMessageFromTaskId(task.id, {
          content: `Description changed:\n${args.input.patch.description}`,
        }).catch((err) => {
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
  return sendMessageFromTaskId(taskId, {
    content: `${await convertToUsernameFormat(
      userId
    )} is working on this task!`,
    allowedMentions: {
      users: [],
    },
  }).catch((err) => {
    console.error("Failed sending 'working on' notification.", err);
  });
}

export async function sendStopWorkingOnMessage(userId: bigint, taskId: bigint) {
  return sendMessageFromTaskId(taskId, {
    content: `${await convertToUsernameFormat(
      userId
    )} stopped working on this task!`,
    allowedMentions: {
      users: [],
    },
  }).catch((err) => {
    console.error("Failed sending 'stopped working on' notification.", err);
  });
}

async function handleDeleteCtf(ctfId: any, guild: Guild) {
  const ctfName = await getCTFNameFromId(ctfId);
  const categoryChannel = guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory && channel.name === ctfName
  ) as CategoryChannel;

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

  guild.roles.cache.map((role) => {
    if (role.name === ctfName) {
      return role.delete();
    }
  });

  categoryChannel.delete();
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
  const ctf = await getCtfById(ctfId);
  await changeDiscordUserRoleForCTF(profileId, ctf, operation);
}

async function handleUpdateCtf(args: any, guild: Guild) {
  const ctf = await getCTFNameFromId(args.input.id);

  const categoryChannel = guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory && channel.name === ctf
  ) as CategoryChannel | undefined;

  if (categoryChannel != null) {
    categoryChannel.setName(args.input.patch.title).catch((err) => {
      console.error("Failed updating category.", err);
    });
  }

  const role = guild?.roles.cache.find((role) => role.name === ctf);
  role?.setName(args.input.patch.title).catch((err) => {
    console.error("Failed updating role.", err);
  });
}

async function sendMessageFromTaskId(
  id: bigint,
  message: MessagePayload | MessageCreateOptions
): Promise<GuildBasedChannel | null> {
  const task = await getTaskFromId(id);
  const ctfName = await getCTFNameFromId(BigInt(task.ctf_id));

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
      channel.parent?.name === ctfName
    ) {
      channel.send(message).catch((err) => {
        console.error("Failed sending message.", err);
      });
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
