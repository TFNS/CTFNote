import {
  CategoryChannel,
  ChannelType,
  Collection,
  CommandInteraction,
  Guild,
  PermissionsBitField,
  Role,
  TextChannel,
} from "discord.js";
import {
  CTF,
  getAllCtfsFromDatabase,
  getCtfFromDatabase,
} from "../database/ctfs";
import { getDiscordUsersThatCanPlayCTF } from "../database/users";
import config from "../../config";
import {
  Task,
  getTaskByCtfIdAndNameFromDatabase,
  getTaskFromId,
  getUserIdsWorkingOnTask,
} from "../database/tasks";
import {
  getTaskTitleFromTopic,
  sendMessageToChannel,
  topicDelimiter,
} from "./messages";
import {
  isChannelOfCtf,
  isTaskChannelOf,
  isRoleOfCtf,
  isCategoryOfCtf,
} from "./comparison";
import { safeSlugify } from "../../utils/utils";

enum CategoryType {
  NEW,
  STARTED,
  SOLVED,
}

export enum ChannelMovingEvent {
  START,
  UNSOLVED,
  SOLVED,
}

export interface TaskInput {
  ctfId: bigint;
  title: string;
  description: string;
  flag: string;
}

const newPrefix = "New - ";
const startedPrefix = "Started - ";
const solvedPrefix = "Solved - ";

export function newCategoryName(ctf: CTF) {
  return newPrefix + ctf.title;
}

export function startedCategoryName(ctf: CTF) {
  return startedPrefix + ctf.title;
}

export function solvedCategoryName(ctf: CTF) {
  return solvedPrefix + ctf.title;
}

export function getCtfNameFromCategoryName(name: string) {
  // cut off the start up to the first prefix and return the rest of the string
  for (const prefix of [newPrefix, startedPrefix, solvedPrefix]) {
    if (name.search(prefix) !== -1)
      return name.substring(name.search(prefix) + prefix.length, name.length);
  }

  return name;
}

function findAvailableCategoryName(guild: Guild, ctf: CTF | string) {
  let i = 0;
  const originalName = typeof ctf === "string" ? ctf : ctf.title;
  let name = originalName;
  while (guild.channels.cache.find((channel) => channel.name === name)) {
    i++;
    name = `(${i}) ${originalName}`;
  }
  return name;
}

async function createCategoryChannel(
  guild: Guild,
  name: CTF | string,
  role: Role | null | undefined = null
) {
  if (role == null) {
    role = guild.roles.cache.find((r) => isRoleOfCtf(r, name));
    if (role == null) {
      console.error(`Could not find role for CTF`, name, role);
      return null;
    }
  }

  return guild?.channels.create({
    name: findAvailableCategoryName(guild, name),
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      // Set permissions for @everyone role (default permissions)
      {
        id: guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel], // Deny view permission to @everyone
      },
      // Set permissions for the allowed role
      {
        id: role.id,
        allow: [PermissionsBitField.Flags.ViewChannel], // Allow view permission to the allowed role
        deny: [
          PermissionsBitField.Flags.CreatePublicThreads,
          PermissionsBitField.Flags.CreatePrivateThreads,
          PermissionsBitField.Flags.SendMessagesInThreads,
          PermissionsBitField.Flags.ManageThreads,
        ],
      },
    ],
  });
}

async function createTaskChannel(
  guild: Guild,
  task: Task,
  category: CategoryChannel
) {
  const taskName = typeof task === "string" ? task : task.title;

  return guild?.channels.create({
    name: taskName,
    type: ChannelType.GuildText,
    parent: category.id,
    topic: taskName + topicDelimiter + " " + (await getTaskLink(task)),
  });
}

export async function createChannelsAndRolesForCtf(guild: Guild, ctf: CTF) {
  const allowedRole = await guild.roles.create({
    name: ctf.title,
    mentionable: true,
  });

  const newCategory = await createCategoryChannel(
    guild,
    newCategoryName(ctf),
    allowedRole
  );
  if (newCategory == null) return;

  const startedCategory = await createCategoryChannel(
    guild,
    startedCategoryName(ctf),
    allowedRole
  );
  if (startedCategory == null) return;

  const solvedCategory = await createCategoryChannel(
    guild,
    solvedCategoryName(ctf),
    allowedRole
  );
  if (solvedCategory == null) return;

  // create challenges-talk channel
  await guild?.channels.create({
    name: `challenges-talk`,
    type: ChannelType.GuildText,
    parent: startedCategory?.id,
  });

  // create voice channels for the ctf from the .env file
  const numberOfVoiceChannels: number = config.discord.voiceChannels;

  if (numberOfVoiceChannels > 0) {
    for (let i = 0; i < numberOfVoiceChannels; i++) {
      guild?.channels
        .create({
          name: `voice-${i}`,
          type: ChannelType.GuildVoice,
          parent: startedCategory.id,
        })
        .catch((err) => {
          console.error("Failed to create one of the voice channels.", err);
        });
    }
  }

  // set correct permissions
  const discordIds: string[] = await getDiscordUsersThatCanPlayCTF(ctf.id);
  discordIds.forEach((discordId) => {
    const member = guild?.members.cache.get(discordId);
    if (member) member.roles.add(allowedRole);
  });
}

export function getChannelCategoriesForCtf(
  guild: Guild,
  ctf: CTF | string
): Collection<string, CategoryChannel> {
  return guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      isCategoryOfCtf(channel, ctf)
  ) as Collection<string, CategoryChannel>;
}

function getNewCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => isCategoryOfCtf(c, newCategoryName(ctf)));
}

function getStartedCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => isCategoryOfCtf(c, startedCategoryName(ctf)));
}

function getSolvedCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => isCategoryOfCtf(c, solvedCategoryName(ctf)));
}

function getTalkChannelForCtf(guild: Guild, ctf: CTF) {
  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.name === `challenges-talk` &&
      isChannelOfCtf(channel, startedCategoryName(ctf))
  ) as TextChannel;
}

export async function getNotFullCategoryForCtf(
  guild: Guild,
  ctf: CTF,
  type: CategoryType
) {
  let categories: Collection<string, CategoryChannel>;

  if (type === CategoryType.NEW) {
    categories = getNewCategoriesForCtf(guild, ctf);
  } else if (type === CategoryType.STARTED) {
    categories = getStartedCategoriesForCtf(guild, ctf);
  } else if (type === CategoryType.SOLVED) {
    categories = getSolvedCategoriesForCtf(guild, ctf);
  } else {
    return null;
  }

  if (categories.size === 0) return null;

  categories = categories.sorted(
    (a, b) => a.createdTimestamp - b.createdTimestamp
  );

  let category: CategoryChannel | null = null;
  categories.forEach((c) => {
    if (
      c.children.cache.size < config.discord.maxChannelsPerCategory &&
      !category
    ) {
      category = c;
    }
  });

  if (category == null) {
    let categoryTitle = "";
    if (type === CategoryType.NEW) {
      categoryTitle = newCategoryName(ctf);
    } else if (type === CategoryType.STARTED) {
      categoryTitle = startedCategoryName(ctf);
    } else if (type === CategoryType.SOLVED) {
      categoryTitle = solvedCategoryName(ctf);
    }
    category = await createCategoryChannel(guild, categoryTitle);

    const position = categories
      .mapValues((c) => c.position || 0)
      .reduce((a, b) => Math.max(a, b), 0);
    category?.setPosition(position + 1);
  }
  return category;
}

export async function createChannelForTaskInCtf(
  guild: Guild,
  task: Task,
  ctf: CTF | null = null,
  announce = false
) {
  // query CTF if not provided
  if (ctf == null) {
    ctf = await getCtfFromDatabase(task.ctf_id);
    if (ctf == null) return;
  }

  let category: CategoryChannel | null;
  if (task.flag != "") {
    category = await getNotFullCategoryForCtf(guild, ctf, CategoryType.SOLVED);
  } else if ((await getUserIdsWorkingOnTask(task)).length > 0) {
    category = await getNotFullCategoryForCtf(guild, ctf, CategoryType.STARTED);
  } else {
    category = await getNotFullCategoryForCtf(guild, ctf, CategoryType.NEW);
  }
  if (category == null) return;

  return handleCreateAndNotify(guild, task, ctf, category, announce);
}

async function getTaskLink(task: Task, ctf: CTF | null = null) {
  if (config.pad.domain == "") return "";

  if (ctf == null) {
    ctf = await getCtfFromDatabase(task.ctf_id);
    if (ctf == null) return "";
  }

  const ssl = config.pad.useSSL == "false" ? "" : "s";

  return `http${ssl}://${config.pad.domain}/#/ctf/${ctf.id}-${safeSlugify(
    ctf.title
  )}/task/${task.id}`;
}

async function pinTaskLinkToChannel(
  channel: TextChannel,
  task: Task,
  ctf: CTF
) {
  const url = await getTaskLink(task, ctf);
  if (url == "") return;

  const message = await sendMessageToChannel(
    channel,
    `CTFNote task: ${url}`,
    true
  );
  if (message == null) return;
}

async function handleCreateAndNotify(
  guild: Guild,
  task: Task,
  ctf: CTF,
  category: CategoryChannel,
  announce = false
) {
  const taskChannel = await createTaskChannel(guild, task, category);
  if (taskChannel == null) return;

  await pinTaskLinkToChannel(taskChannel, task, ctf);
  await sendMessageToChannel(taskChannel, task.description);

  if (announce)
    await sendMessageToChannel(
      getTalkChannelForCtf(guild, ctf),
      `New task created: ${task.title}`,
      false
    );

  return taskChannel;
}

export async function createChannelForNewTask(
  guild: Guild,
  newTask: Task,
  announce = false
) {
  const ctf = await getCtfFromDatabase(newTask.ctf_id);
  if (ctf == null) return;

  let movingType = CategoryType.NEW;

  if (newTask.flag != "") {
    movingType = CategoryType.SOLVED;
  }

  const category = await getNotFullCategoryForCtf(guild, ctf, movingType);
  if (category == null) {
    console.error(
      "Could not find a non-full category for new task",
      newTask,
      announce
    );
    return;
  }

  return handleCreateAndNotify(guild, newTask, ctf, category, announce);
}

export async function getTaskChannel(
  guild: Guild,
  task: Task,
  ctf: CTF | null
) {
  if (ctf == null) {
    ctf = await getCtfFromDatabase(task.ctf_id);
    if (ctf == null) return null;
  }

  // to get arround TypeScript's type system
  const c = ctf;

  const taskChannel = guild.channels.cache.find((channel) => {
    if (isTaskChannelOf(channel, task) && isChannelOfCtf(channel, c)) {
      return channel;
    }
  });

  if (taskChannel == null) return null;
  return taskChannel as TextChannel;
}

export async function getCurrentTaskChannelFromDiscord(
  interaction: CommandInteraction
) {
  if (interaction.channel == null) return null;

  if (interaction.channel.type !== ChannelType.GuildText) return null;

  const category = interaction.channel.parent;
  if (category == null) return null;

  const ctf = await getCtfFromDatabase(
    getCtfNameFromCategoryName(category.name)
  );
  if (ctf == null) return null;
  if (interaction.channel.topic == null) return null;

  const name = getTaskTitleFromTopic(interaction.channel.topic);
  if (name == null) return null;

  const task = await getTaskByCtfIdAndNameFromDatabase(ctf.id, name);
  if (task == null) return null;

  return { ctf: ctf, task: task, channel: interaction.channel };
}

export async function moveChannel(
  guild: Guild,
  task: Task | bigint,
  ctf: CTF | null,
  operation: ChannelMovingEvent
) {
  if (typeof task === "bigint" || typeof task === "number") {
    const t = await getTaskFromId(task);
    if (t == null) return;
    task = t;
  }

  if (ctf == null) {
    ctf = await getCtfFromDatabase(task.ctf_id);
    if (ctf == null) return;
  }
  const taskChannel = await getTaskChannel(guild, task, ctf);
  if (taskChannel == null) {
    console.error("Task channel not found", task, ctf, operation);
    return;
  }

  // if channel is not in 'new' category, skip
  if (
    operation === ChannelMovingEvent.START &&
    !isChannelOfCtf(taskChannel, newCategoryName(ctf))
  )
    return;

  // if channel is already in 'solved' category, skip
  if (
    operation === ChannelMovingEvent.SOLVED &&
    isChannelOfCtf(taskChannel, solvedCategoryName(ctf))
  )
    return;

  // if channel is not in 'solved' category, skip
  if (
    operation === ChannelMovingEvent.UNSOLVED &&
    !isChannelOfCtf(taskChannel, solvedCategoryName(ctf))
  )
    return;

  let targetParent: CategoryChannel | null = null;

  if (
    operation === ChannelMovingEvent.START ||
    operation === ChannelMovingEvent.UNSOLVED
  ) {
    targetParent = await getNotFullCategoryForCtf(
      guild,
      ctf,
      CategoryType.STARTED
    );
  } else if (operation === ChannelMovingEvent.SOLVED) {
    targetParent = await getNotFullCategoryForCtf(
      guild,
      ctf,
      CategoryType.SOLVED
    );
  }

  if (targetParent == null) return;

  await taskChannel.setParent(targetParent);
}
/*
 * Returns the CTF names of all categories that are currently active in the Discord server.
 */
export async function getActiveCtfCategories(guild: Guild): Promise<string[]> {
  const allCtfs = await getAllCtfsFromDatabase();

  return allCtfs.filter((ctf) =>
    guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildCategory &&
        isCategoryOfCtf(channel, ctf)
    )
  );
}
