import { Build, Context } from "postgraphile";
import { SchemaBuilder } from "graphile-build";
import { ChannelType, Guild } from "discord.js";
import {
  getAccessibleCTFsForUser,
  getAllCtfsFromDatabase,
  getCtfFromDatabase,
  getNameFromUserId,
} from "../discord/database/ctfs";
import { getDiscordGuild, usingDiscordBot } from "../discord";
import { changeDiscordUserRoleForCTF } from "../discord/commands/linkUser";
import { getDiscordIdFromUserId } from "../discord/database/users";
import {
  Task,
  getTaskByCtfIdAndNameFromDatabase,
  getTaskFromId,
} from "../discord/database/tasks";
import { sendMessageToTask } from "../discord/utils/messages";
import {
  ChannelMovingEvent,
  createChannelForNewTask,
  getActiveCtfCategories,
  getTaskChannel,
  moveChannel,
} from "../discord/utils/channels";
import { isCategoryOfCtf } from "../discord/utils/comparison";
import { GraphQLResolveInfoWithMessages } from "@graphile/operation-hooks";

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

  if (member.displayName.toLowerCase() !== name.toLowerCase()) {
    return `${member.user} (${name})`;
  } else {
    return `${member.user}`;
  }
}

export async function handleTaskSolved(
  guild: Guild,
  id: bigint,
  userId: bigint | string
) {
  const task = await getTaskFromId(id);
  if (task == null) return;

  await moveChannel(guild, task, null, ChannelMovingEvent.SOLVED);

  return sendMessageToTask(
    guild,
    id,
    `${task.title} is solved by ${await convertToUsernameFormat(userId)}!`
  );
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
    fieldContext.scope.fieldName !== "cancelWorkingOn" &&
    fieldContext.scope.fieldName !== "updateCtf" &&
    fieldContext.scope.fieldName !== "createInvitation" &&
    fieldContext.scope.fieldName !== "deleteInvitation" &&
    fieldContext.scope.fieldName !== "resetDiscordId" &&
    fieldContext.scope.fieldName !== "deleteCtf" &&
    fieldContext.scope.fieldName !== "updateUserRole"
  ) {
    return null;
  }

  const handleDiscordMutationAfter = async (
    input: any,
    args: any,
    context: any,
    _resolveInfo: GraphQLResolveInfoWithMessages
  ) => {
    const guild = getDiscordGuild();
    if (guild == null) return input;

    //add challenges to the ctf channel discord
    if (fieldContext.scope.fieldName === "createTask") {
      // we have to query the task using the context.pgClient in order to see the newly created task
      const task = await getTaskByCtfIdAndNameFromDatabase(
        args.input.ctfId,
        args.input.title,
        context.pgClient
      );
      if (task == null) return input;

      // we have to await this since big imports will cause race conditions with the Discord API
      await createChannelForNewTask(guild, task, true);
    }
    if (fieldContext.scope.fieldName === "deleteTask") {
      const task = await getTaskFromId(args.input.id);
      if (task == null) return input;

      const channel = await getTaskChannel(guild, task, null);
      if (channel == null) return input;

      channel
        .setName(`deleted-${task.title}`)
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

          handleTaskSolved(guild, args.input.id, userId);
        } else {
          const task = await getTaskFromId(args.input.id);
          if (task == null) return input;

          moveChannel(guild, task, null, ChannelMovingEvent.UNSOLVED);
        }
      }

      // handle task title change
      if (
        args.input.patch.title != null &&
        args.input.patch.title != task.title
      ) {
        const channel = await getTaskChannel(guild, task, null);
        if (channel == null) return input;

        channel
          .edit({
            name: title,
            topic: channel.topic?.replace(task.title, title),
          })
          .catch((err) => console.error("Failed to rename channel.", err));
      }

      // handle task description change
      if (
        args.input.patch.description != null &&
        args.input.patch.description !== task.description
      ) {
        sendMessageToTask(
          guild,
          task,
          `Description changed:\n${args.input.patch.description}`
        );
      }
    }

    if (fieldContext.scope.fieldName === "startWorkingOn") {
      //send a message to the channel that the user started working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;
      moveChannel(guild, taskId, null, ChannelMovingEvent.START).then(() => {
        sendStartWorkingOnMessage(guild, userId, taskId).catch((err) => {
          console.error(
            "Failed sending 'started working on' notification.",
            err
          );
        });
      });
    }
    if (
      fieldContext.scope.fieldName === "stopWorkingOn" ||
      fieldContext.scope.fieldName === "cancelWorkingOn"
    ) {
      //send a message to the channel that the user stopped working on the task
      const userId = context.jwtClaims.user_id;
      const taskId = args.input.taskId;

      sendStopWorkingOnMessage(
        guild,
        userId,
        taskId,
        fieldContext.scope.fieldName === "cancelWorkingOn"
      ).catch((err) => {
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

    if (fieldContext.scope.fieldName === "updateUserRole") {
      const userId = args.input.userId;

      // reset all roles
      const currentCtfs = await getActiveCtfCategories(guild);
      await Promise.all(
        currentCtfs.map(async function (ctf) {
          return changeDiscordUserRoleForCTF(userId, ctf, "remove").catch(
            (err) => {
              console.error("Error while adding role to user: ", err);
            }
          );
        })
      );
      // re-assign roles if accessible
      const ctfs = await getAccessibleCTFsForUser(userId, context.pgClient);
      ctfs.forEach(function (ctf) {
        changeDiscordUserRoleForCTF(userId, ctf, "add").catch((err) => {
          console.error("Error while adding role to user: ", err);
        });
      });
    }

    return input;
  };

  const handleDiscordMutationBefore = async (
    input: any,
    args: any,
    context: any,
    _resolveInfo: GraphQLResolveInfoWithMessages
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
  guild: Guild,
  userId: bigint,
  task: Task | bigint
) {
  await moveChannel(guild, task, null, ChannelMovingEvent.START);
  return sendMessageToTask(
    guild,
    task,
    `${await convertToUsernameFormat(userId)} is working on this task!`
  );
}

export async function sendStopWorkingOnMessage(
  guild: Guild,
  userId: bigint,
  task: Task | bigint,
  cancel = false
) {
  let text = "stopped";
  if (cancel) {
    text = "cancelled";
  }
  return sendMessageToTask(
    guild,
    task,
    `${await convertToUsernameFormat(userId)} ${text} working on this task!`
  );
}

export async function handleDeleteCtf(ctfId: string | bigint, guild: Guild) {
  const ctf = await getCtfFromDatabase(ctfId);
  if (ctf == null) return;

  const categoryChannels = guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      isCategoryOfCtf(channel, ctf)
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

  const categoryChannels = guild?.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      isCategoryOfCtf(channel, ctf)
  );

  categoryChannels.map((categoryChannel) => {
    categoryChannel
      .setName(categoryChannel.name.replace(ctf.title, args.input.patch.title))
      .catch((err) => {
        console.error("Failed updating category.", err);
      });
  });

  const role = guild?.roles.cache.find((role) => role.name === ctf.title);
  role?.setName(args.input.patch.title).catch((err) => {
    console.error("Failed updating role.", err);
  });
}

export default function (builder: SchemaBuilder): void {
  builder.hook("init", (_, build) => {
    build.addOperationHook(discordMutationHook(build));
    return _;
  });
}
