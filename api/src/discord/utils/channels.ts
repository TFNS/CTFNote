import {
  CategoryChannel,
  ChannelType,
  Collection,
  Guild,
  GuildBasedChannel,
  PermissionsBitField,
  Role,
  TextChannel,
} from "discord.js";
import { CTF, getCtfFromDatabase } from "../database/ctfs";
import { getDiscordUsersThatCanPlayCTF } from "../database/users";
import config from "../../config";
import { Task, getUserIdsWorkingOnTask } from "../database/tasks";
import { sendMessageToChannel } from "./messages";

enum CategoryType {
  NEW,
  STARTED,
  SOLVED,
}

function newCategoryName(ctf: CTF) {
  return `${ctf.title} - New`;
}

function startedCategoryName(ctf: CTF) {
  return `${ctf.title} - Started`;
}

function solvedCategoryName(ctf: CTF) {
  return `${ctf.title} - Solved`;
}

function findAvailableCategory(guild: Guild, originalName: string) {
  let i = 0;
  let name = originalName;
  while (guild.channels.cache.find((channel) => channel.name === name)) {
    i++;
    name = `${originalName} (${i})`;
  }
  return name;
}

async function createCategoryChannel(
  guild: Guild,
  name: string,
  role: Role | null | undefined = null
) {
  if (role == null) {
    role = guild.roles.cache.find((r) => name.startsWith(r.name));
    if (role == null) {
      console.error(`Could not find role for ${name}`);
      return null;
    }
  }

  return guild?.channels.create({
    name: findAvailableCategory(guild, name),
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
  task: Task | TaskInput | string,
  category: CategoryChannel
) {
  const taskName = typeof task === "string" ? task : task.title;

  return guild?.channels.create({
    name: taskName,
    type: ChannelType.GuildText,
    parent: category.id,
    topic: taskName,
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

function getChannelCategoriesForCtf(
  guild: Guild,
  ctf: CTF
): Collection<string, CategoryChannel> {
  return guild.channels.cache.filter(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      channel.name.startsWith(ctf.title)
  ) as Collection<string, CategoryChannel>;
}

function getNewCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => c.name.startsWith(newCategoryName(ctf)));
}

function getStartedCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => c.name.startsWith(startedCategoryName(ctf)));
}

function getSolvedCategoriesForCtf(guild: Guild, ctf: CTF) {
  const categories = getChannelCategoriesForCtf(guild, ctf);
  return categories.filter((c) => c.name.startsWith(solvedCategoryName(ctf)));
}

function getTalkChannelForCtf(guild: Guild, ctf: CTF) {
  return guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.name === `challenges-talk` &&
      channel.parent?.name.startsWith(startedCategoryName(ctf))
  ) as TextChannel;
}

async function getNotFullCategoryForCtf(
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

  let category: CategoryChannel | null = null;
  categories.forEach((c) => {
    if (c.children.cache.size < config.discord.maxChannelsPerCategory) {
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
    ctf = await getCtfFromDatabase(task.ctfId);
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

async function handleCreateAndNotify(
  guild: Guild,
  task: Task | TaskInput,
  ctf: CTF,
  category: CategoryChannel,
  announce = false
) {
  const taskChannel = await createTaskChannel(guild, task, category);
  if (taskChannel == null) return;

  await sendMessageToChannel(taskChannel, task.description);

  if (announce)
    await sendMessageToChannel(
      getTalkChannelForCtf(guild, ctf),
      `New task created: ${task.title}`,
      false
    );

  return taskChannel;
}

export interface TaskInput {
  ctfId: bigint;
  title: string;
  description: string;
  flag: string;
}

export async function createChannelForNewTask(
  guild: Guild,
  newTask: TaskInput,
  announce = false
) {
  const ctf = await getCtfFromDatabase(newTask.ctfId);
  if (ctf == null) return;

  const category = await getNotFullCategoryForCtf(guild, ctf, CategoryType.NEW);
  if (category == null) return;

  return handleCreateAndNotify(guild, newTask, ctf, category, announce);
}
