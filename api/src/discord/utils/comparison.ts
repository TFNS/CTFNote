import {
  CategoryChannel,
  ChannelType,
  GuildBasedChannel,
  Role,
} from "discord.js";
import { CTF } from "../database/ctfs";
import { Task } from "../database/tasks";
import { getCtfNameFromCategoryName } from "./channels";
import { getTaskTitleFromTopic } from "./messages";

export function isCategoryOfCtf(
  channel: CategoryChannel | undefined | null,
  ctf: CTF | string
) {
  if (channel == null) return false;
  const ctfTitle = typeof ctf === "string" ? ctf : ctf.title;

  return channel.name.endsWith(ctfTitle);
}

export function isChannelOfCtf(
  channel: GuildBasedChannel | undefined | null,
  ctf: CTF | string
) {
  if (channel == null) return false;
  const ctfTitle = typeof ctf === "string" ? ctf : ctf.title;

  if (channel.parent == null) return false;
  if (channel.parent.type !== ChannelType.GuildCategory) return false;

  return isCategoryOfCtf(channel.parent, ctfTitle);
}

export function isTaskChannelOf(
  channel: GuildBasedChannel,
  task: Task | string
) {
  const taskTitle = typeof task === "string" ? task : task.title;

  if (channel.type !== ChannelType.GuildText) return false;
  if (channel.topic == null) return false;

  return getTaskTitleFromTopic(channel.topic) == taskTitle;
}

export function isRoleOfCtf(role: Role | string, ctf: CTF | string) {
  const ctfTitle = typeof ctf === "string" ? ctf : ctf.title;
  const roleName = typeof role === "string" ? role : role.name;

  return roleName === getCtfNameFromCategoryName(ctfTitle);
}
