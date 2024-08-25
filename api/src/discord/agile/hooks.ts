import { Build, Context } from "postgraphile";
import { ChannelType, Guild } from "discord.js";
import {
  getAccessibleCTFsForUser,
  getAllCtfsFromDatabase,
  getCtfFromDatabase,
} from "../database/ctfs";
import { getDiscordGuild, usingDiscordBot } from "..";
import { changeDiscordUserRoleForCTF } from "./commands/linkUser";
import { getUserIdFromUsername } from "../database/users";
import {
  Task,
  getTaskByCtfIdAndNameFromDatabase,
  getTaskFromId,
} from "../database/tasks";
import { sendMessageToTask } from "../utils/messages";
import {
  ChannelMovingEvent,
  createChannelForNewTask,
  getActiveCtfCategories,
  getTaskChannel,
  moveChannel,
} from "./channels";
import { isCategoryOfCtf } from "../utils/comparison";
import { GraphQLResolveInfoWithMessages } from "@graphile/operation-hooks";
import { syncDiscordPermissionsWithCtf } from "../utils/permissionSync";
import { convertToUsernameFormat } from "../utils/user";
import { PoolClient } from "pg";
import { handleTaskSolved } from "./commands/solveTask";

async function handleCreateTask(
  guild: Guild,
  ctfId: bigint,
  title: string,
  pgClient: PoolClient | null
) {
  // we have to query the task using the context.pgClient in order to see the newly created task
  const task = await getTaskByCtfIdAndNameFromDatabase(ctfId, title, pgClient);
  if (task == null) return null;

  // we have to await this since big imports will cause race conditions with the Discord API
  await createChannelForNewTask(guild, task, true);
}

async function handleDeleteTask(guild: Guild, taskId: bigint) {
  const task = await getTaskFromId(taskId);
  if (task == null) return null;

  const channel = await getTaskChannel(guild, task, null);
  if (channel == null) return null;

  channel
    .setName(`deleted-${task.title}`)
    .catch((err) => console.error("Failed to mark channel as deleted.", err));
}

async function handleUpdateTask(
  guild: Guild,
  taskId: bigint | null,
  newTitle: string | null,
  newFlag: string | null,
  newDescription: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  if (taskId == null) return null;

  const task = await getTaskFromId(taskId);
  if (task == null) return null;

  if (newFlag != null) {
    if (newFlag !== "") {
      const userId = context.jwtClaims.user_id;

      handleTaskSolved(guild, taskId, userId);
    } else {
      const task = await getTaskFromId(taskId);
      if (task == null) return null;

      moveChannel(guild, task, null, ChannelMovingEvent.UNSOLVED);
    }
  }

  // handle task title change
  if (newTitle != null && newTitle != task.title) {
    const channel = await getTaskChannel(guild, task, null);
    if (channel == null) return null;

    channel
      .edit({
        name: newTitle,
        topic: channel.topic?.replace(task.title, newTitle),
      })
      .catch((err) => console.error("Failed to rename channel.", err));
  }

  // handle task description change
  if (newDescription != null && newDescription !== task.description) {
    sendMessageToTask(guild, task, `Description changed:\n${newDescription}`);
  }
}

async function handleStartWorkingOn(
  guild: Guild,
  taskId: bigint,
  userId: bigint
) {
  await moveChannel(guild, taskId, null, ChannelMovingEvent.START);
  await sendStartWorkingOnMessage(guild, userId, taskId);
}

async function handleUpdateUserRole(
  guild: Guild,
  userId: bigint,
  pgClient: PoolClient
) {
  // reset all roles
  const currentCtfs = await getActiveCtfCategories(guild);
  await Promise.all(
    currentCtfs.map(async function (ctf) {
      return changeDiscordUserRoleForCTF(userId, ctf, "remove").catch((err) => {
        console.error("Error while adding role to user: ", err);
      });
    })
  );
  // re-assign roles if accessible
  const ctfs = await getAccessibleCTFsForUser(userId, pgClient);
  ctfs.forEach(function (ctf) {
    changeDiscordUserRoleForCTF(userId, ctf, "add").catch((err) => {
      console.error("Error while adding role to user: ", err);
    });
  });
}

async function handleRegisterWithToken(username: string) {
  /*
   * We have a nice ductape solution for the following problem:
   * During the handling of these hooks, the changes to the database are not committed yet.
   * This means that we can't query the database for the new user id.
   * We have to wait a bit to make sure the user is in the database.
   * Alternatively we can hook the postgraphile lifecycle but that is not compatible with the current setup.
   * The outgoing request is probably handling within 1 second, so this works fine.
   */
  setTimeout(async () => {
    const userId = await getUserIdFromUsername(username, null); // use null to get a new client which is privileged as the Discord bot
    if (userId == null) return;
    const ctfs = await getAccessibleCTFsForUser(userId, null);
    for (let i = 0; i < ctfs.length; i++) {
      await changeDiscordUserRoleForCTF(userId, ctfs[i], "add").catch((err) => {
        console.error("Error while adding role to user: ", err);
      });
    }
  }, 2000);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
    fieldContext.scope.fieldName !== "updateUserRole" &&
    fieldContext.scope.fieldName !== "setDiscordEventLink" &&
    fieldContext.scope.fieldName !== "registerWithToken"
  ) {
    return null;
  }

  const handleDiscordMutationAfter = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _resolveInfo: GraphQLResolveInfoWithMessages
  ) => {
    const guild = getDiscordGuild();
    if (guild == null) return input;

    //add challenges to the ctf channel discord
    switch (fieldContext.scope.fieldName) {
      case "createTask":
        handleCreateTask(
          guild,
          args.input.ctfId,
          args.input.title,
          context.pgClient
        ).catch((err) => {
          console.error("Failed to create task.", err);
        });
        break;
      case "deleteTask":
        handleDeleteTask(guild, args.input.id).catch((err) => {
          console.error("Failed to delete task.", err);
        });
        break;
      case "updateTask":
        handleUpdateTask(
          guild,
          args.input.id,
          args.input.patch.title,
          args.input.patch.flag,
          args.input.patch.description,
          context
        ).catch((err) => {
          console.error("Failed to update task.", err);
        });
        break;
      case "startWorkingOn":
        handleStartWorkingOn(
          guild,
          args.input.taskId,
          context.jwtClaims.user_id
        ).catch((err) => {
          console.error("Failed to start working on task.", err);
        });
        break;
      case "stopWorkingOn":
      case "cancelWorkingOn":
        sendStopWorkingOnMessage(
          guild,
          context.jwtClaims.user_id,
          args.input.taskId,
          fieldContext.scope.fieldName === "cancelWorkingOn"
        ).catch((err) => {
          console.error(
            "Failed sending 'stopped working on' notification.",
            err
          );
        });
        break;
      case "createInvitation":
        handeInvitation(
          args.input.invitation.ctfId,
          args.input.invitation.profileId,
          "add"
        ).catch((err) => {
          console.error("Failed to create invitation.", err);
        });
        break;
      case "deleteInvitation":
        handeInvitation(args.input.ctfId, args.input.profileId, "remove").catch(
          (err) => {
            console.error("Failed to delete invitation.", err);
          }
        );
        break;
      case "updateUserRole":
        handleUpdateUserRole(guild, args.input.userId, context.pgClient).catch(
          (err) => {
            console.error("Failed to update user role.", err);
          }
        );
        break;
      case "setDiscordEventLink":
        await syncDiscordPermissionsWithCtf(
          guild,
          args.input.ctfId,
          args.input.link,
          context.pgClient
        ).catch((err) => {
          console.error("Failed to sync discord permissions.", err);
        });
        break;
      case "registerWithToken":
        handleRegisterWithToken(args.input.login).catch((err) => {
          console.error("Failed to register with token.", err);
        });
        break;
      default:
        break;
    }
    return input;
  };

  const handleDiscordMutationBefore = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _resolveInfo: GraphQLResolveInfoWithMessages
  ) => {
    const guild = getDiscordGuild();
    if (guild === null) return input;

    switch (fieldContext.scope.fieldName) {
      case "updateCtf":
        handleUpdateCtf(args, guild).catch((err) => {
          console.error("Failed to update ctf.", err);
        });
        break;
      case "deleteCtf":
        handleDeleteCtf(args.input.id, guild).catch((err) => {
          console.error("Failed to delete ctf.", err);
        });
        break;
      case "resetDiscordId":
        // we need to use the await here to prevent a race condition
        // between deleting the discord id and retrieving the discord id (to remove the roles)
        await handleResetDiscordId(context.jwtClaims.user_id).catch((err) => {
          console.error("Failed to reset discord id.", err);
        });
        break;
      default:
        break;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default {
  operationHook: discordMutationHook,
};
