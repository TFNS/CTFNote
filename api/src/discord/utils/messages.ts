import {
  CategoryChannel,
  ChannelType,
  Collection,
  Guild,
  Message,
  MessageFlags,
  Snowflake,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import config from "../../config";
import { Task, getTaskFromId } from "../database/tasks";
import { CTF, getCtfFromDatabase } from "../database/ctfs";
import { getTaskChannel } from "./channels";
import { createPad } from "../../plugins/createTask";

export const discordArchiveTaskName = "Discord archive";

export async function sendMessageToChannel(
  channel: TextChannel,
  message: string | null | undefined,
  silent = true
) {
  if (message == "" || message == null) return null;
  const options = {
    content: message,
    allowedMentions: {
      users: [],
    },
    flags: [] as number[],
  };

  // still send the message if the last message was sent by the bot and within ten minutes interval
  if (!silent) {
    const latestMessages = await channel.messages.fetch({ limit: 1 });
    if (latestMessages.size > 0) {
      const lastMessage = latestMessages.first();
      if (
        lastMessage?.author.username === config.discord.botName &&
        lastMessage?.createdTimestamp > Date.now() - 600000
      ) {
        silent = true;
      }
    }
  }

  if (silent) {
    options.flags = [MessageFlags.SuppressNotifications];
  }

  return await channel.send(options).catch((err) => {
    console.error("Failed to send message to channel", channel, message, err);
  });
}

export async function sendMessageToTask(
  guild: Guild,
  task: Task | bigint,
  message: string | null | undefined,
  ctf: CTF | null = null
) {
  if (typeof task === "bigint" || typeof task === "number") {
    const t = await getTaskFromId(task);
    if (t == null) return null;
    task = t;
  }

  if (ctf == null) {
    ctf = await getCtfFromDatabase(task.ctf_id);
  }
  if (ctf == null) return null;

  const taskChannel = await getTaskChannel(guild, task, ctf);
  if (taskChannel == null) return null;

  return sendMessageToChannel(taskChannel, message);
}

async function getMessagesOfCategory(category: CategoryChannel) {
  const messages: Message<boolean>[] = [];
  await Promise.all(
    category.children.cache
      .filter((c) => c.type === ChannelType.GuildText)
      .map(async (channel) => {
        const channelMessages = await getMessagesOfChannel(
          channel as TextBasedChannel
        );
        channelMessages.mapValues((message) => {
          messages.push(message);
        });
      })
  );
  return messages;
}

export async function getMessagesOfCategories(categories: CategoryChannel[]) {
  const messages: Message<boolean>[] = [];
  await Promise.all(
    categories.map(async (category) => {
      (await getMessagesOfCategory(category)).forEach((message) => {
        messages.push(message);
      });
    })
  );

  return messages;
}

async function getMessagesOfChannel(channel: TextBasedChannel) {
  let messages = new Collection<Snowflake, Message>();

  let channelMessages = await channel.messages.fetch({ limit: 100 });
  while (channelMessages.size > 0) {
    messages = messages.concat(channelMessages);
    channelMessages = await channel.messages.fetch({
      limit: 100,
      before: channelMessages.last()!.id,
    });
  }

  return messages;
}

// source: https://stackoverflow.com/a/38327540
/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
function groupBy<K, V>(
  list: Array<V>,
  keyGetter: (input: V) => K
): Map<K, Array<V>> {
  const map = new Map<K, Array<V>>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export async function convertMessagesToPadFormat(messages: Message<boolean>[]) {
  messages = messages.reverse();
  const groupedByCategory = groupBy(
    Array.from(messages.values()),
    (message) => {
      const channel = message.channel as TextChannel;
      return channel.parent ? channel.parent.name : "without category";
    }
  );

  if (messages.length > 0) {
    // update guild member list for mentions
    await messages[0].guild?.members.fetch();
  }

  const result: string[] = [];

  groupedByCategory.forEach((messagesInCategory, category) => {
    result.push(`# ${category}`);
    const grouped = groupBy(messagesInCategory, (message) => message.channelId);

    grouped.forEach((messages) => {
      const channel = messages[0].channel;
      if (channel.type !== ChannelType.GuildText) return;

      if (messages.length < 2) return; // don't include channels with one message, since that is only the bot message

      result.push(`## ${channel.name}`);

      messages.forEach((message) => {
        const timestamp = new Date(message.createdTimestamp).toLocaleString();

        if (message.attachments.size > 0) {
          message.attachments.forEach((attachment) => {
            if (attachment.contentType?.startsWith("image/")) {
              message.content += ` ![${attachment.name}](${attachment.url}) `;
            } else {
              message.content += ` ${attachment.url} `;
            }
          });
        }

        let content = message.content;
        if (content.startsWith("```")) content = "\n" + content;
        if (content.startsWith("> ")) content = content + "\n"; // need an extra line break for quotes

        // resolve mentions to usernames or channelnames
        const mentions = content.match(/<(?:[^\d>]+|:[A-Za-z0-9]+:)\w+>/g);
        if (mentions != null) {
          mentions.forEach((mention) => {
            const id = mention.replace(/\D/g, "");
            const discordUser = message.guild?.members.cache.get(id);
            const discordChannel = message.guild?.channels.cache.get(id);

            if (discordUser != null) {
              const nickname =
                discordUser.nickname != null
                  ? ` (${discordUser.nickname})`
                  : ``;
              content = content.replace(
                mention,
                discordUser.user.discriminator != "0"
                  ? `@${discordUser.user.username}#${discordUser.user.discriminator}${nickname}`
                  : `@${discordUser.user.username}${nickname}`
              );
            }

            if (discordChannel != null) {
              content = content.replace(mention, `#${discordChannel.name}`);
            }
          });
        }

        const formattedMessage = `[${timestamp}] ${message.author.username}: ${content}`;
        result.push(formattedMessage);
      });
    });
  });

  return result;
}

export async function createPadWithoutLimit(
  messages: string[],
  ctfTitle: string
) {
  const MAX_PAD_LENGTH = config.pad.documentMaxLength - 1000 - messages.length; // some margin to be safe

  const pads = [];
  let currentPadMessages = [];
  let currentPadLength = 0;
  let padIndex = 1;

  for (const message of messages) {
    const messageLength = message.length;

    // If adding the current message exceeds the maximum pad length
    if (currentPadLength + messageLength > MAX_PAD_LENGTH) {
      // Create a new pad
      const padUrl = await createPad(
        `${ctfTitle} ${discordArchiveTaskName} (${padIndex})`,
        currentPadMessages.join("\n")
      );

      pads.push(padUrl);

      // Reset the current pad messages and length
      currentPadMessages = [];
      currentPadLength = 0;
      padIndex++;
    }

    // Add the message to the current pad
    currentPadMessages.push(message);
    currentPadLength += messageLength + 1;
  }
  let firstPadContent = "";
  if (pads.length > 0) {
    // Create the final pad for the remaining messages
    const padUrl = await createPad(
      `${ctfTitle} ${discordArchiveTaskName} (${padIndex})`,
      currentPadMessages.join("\n")
    );
    pads.push(padUrl);

    // Create the first pad with links to other pads
    firstPadContent = pads
      .map((padUrl, index) => `[Pad ${index + 1}](${padUrl})`)
      .join("\n");
  } else {
    firstPadContent = currentPadMessages.join("\n");
  }

  return await createPad(
    `${ctfTitle} ${discordArchiveTaskName}`,
    firstPadContent
  );
}

export const topicDelimiter = " /-/";

export function getTaskTitleFromTopic(topic: string) {
  const splitted = topic.split(topicDelimiter);
  const r = splitted.pop();
  if (r == null) return topic;
  return splitted.join(topicDelimiter);
}
