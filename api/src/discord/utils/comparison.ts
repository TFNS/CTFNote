import { ChannelType, GuildBasedChannel } from "discord.js";
import { CTF } from "../database/ctfs";
import { Task } from "../database/tasks";

export function channelIsChildOfCtf(
  channel: GuildBasedChannel,
  ctf: CTF | string
) {
  const ctfTitle = typeof ctf === "string" ? ctf : ctf.title;

  if (channel.parent == null) return false;

  return channel.parent.name.startsWith(ctfTitle);
}

export function channelIsTask(channel: GuildBasedChannel, task: Task | string) {
  const taskTitle = typeof task === "string" ? task : task.title;

  if (channel.type !== ChannelType.GuildText) return false;

  return channel.topic == taskTitle;
}
