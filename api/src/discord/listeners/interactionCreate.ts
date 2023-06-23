import {
  CategoryChannel,
  ChannelType,
  Client,
  Collection,
  CommandInteraction,
  Interaction,
  Message,
  PermissionsBitField,
  Snowflake,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { Commands } from "../commands";
import {
  createTask,
  getChallengesFromDatabase,
  getCtfIdFromDatabase,
} from "../database/ctfs";
import { createPad } from "../../plugins/createTask";
import config from "../../config";
import { getDiscordUsersThatCanPlayCTF } from "../database/users";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    //check if it is a button interaction
    if (interaction.isButton()) {
      //create the ctf channels and roles
      if (interaction.customId.startsWith("create-ctf-button-")) {
        const ctfName = interaction.customId.replace("create-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Creating the CTF channels and roles for ${ctfName}`,
          components: [],
        });

        const allowedRole = await interaction.guild?.roles.create({
          name: ctfName,
          color: "Random",
          mentionable: true,
        });

        if (!allowedRole) return;

        const channel = await interaction.guild?.channels.create({
          name: `${ctfName}`,
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            // Set permissions for @everyone role (default permissions)
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel], // Deny view permission to @everyone
            },
            // Set permissions for the allowed role
            {
              id: allowedRole.id,
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

        await interaction.guild?.channels.create({
          name: `challenges-talk`,
          type: ChannelType.GuildText,
          parent: channel?.id,
        });

        // assign roles to users already having access to the ctf
        const ctfId: bigint = await getCtfIdFromDatabase(ctfName);
        const discordIds: string[] = await getDiscordUsersThatCanPlayCTF(ctfId);
        discordIds.forEach((discordId) => {
          const member = interaction.guild?.members.cache.get(discordId);
          if (member) member.roles.add(allowedRole);
        });

        // create voice channels for the ctf from the .env file
        const numberOfVoiceChannels: number = config.discord.voiceChannels;

        if (numberOfVoiceChannels > 0) {
          for (let i = 0; i < numberOfVoiceChannels; i++) {
            interaction.guild?.channels
              .create({
                name: `voice-${i}`,
                type: ChannelType.GuildVoice,
                parent: channel?.id,
              })
              .catch((err) => {
                console.error(
                  "Failed to create one of the voice channels.",
                  err
                );
              });
          }
        }

        // create for every challenge a channel
        const challenges = await getChallengesFromDatabase(ctfId);

        for (const challenge of challenges) {
          interaction.guild?.channels
            .create({
              name:
                challenge.flag != ""
                  ? `solved-${challenge.title}`
                  : `${challenge.title}`,
              type: ChannelType.GuildText,
              parent: channel?.id,
              topic: challenge.title,
            })
            .then((challengeChannel) => {
              if (challenge.description !== "") {
                return challengeChannel?.send(challenge.description);
              }
            })
            .catch((err) => {
              console.error("Failed to create channel.", err);
            });
        }
      } else if (interaction.customId.startsWith("archive-ctf-button-")) {
        const ctfName = interaction.customId.replace("archive-ctf-button-", "");
        await interaction.deferUpdate();
        await interaction.editReply({
          content: `Archiving the CTF channels and roles for ${ctfName}`,
          components: [],
        });

        const categoryChannel = (await interaction.guild?.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildCategory &&
            channel.name === ctfName
        )) as CategoryChannel;

        interaction.guild?.channels.cache.map((channel) => {
          if (
            channel.type === ChannelType.GuildVoice &&
            channel.parentId === categoryChannel.id
          ) {
            return channel.delete();
          }
        });

        const allMessages: any[] = [];

        const awaitingPromises = interaction.guild?.channels.cache.map(
          async (channel) => {
            if (
              channel.type === ChannelType.GuildText &&
              channel.parentId === categoryChannel.id
            ) {
              try {
                const messages = await fetchAllMessages(
                  channel as TextBasedChannel
                );
                allMessages.push(messages);

                // Wait until fetchAllMessages is completed before deleting the channels
                await channel.delete();
              } catch (err) {
                console.error(
                  "Failed to fetch messages or delete channel during archiving.",
                  err
                );
              }
              return true;
            }
          }
        );
        if (awaitingPromises !== undefined) await Promise.all(awaitingPromises);

        await categoryChannel.delete();

        interaction.guild?.roles.cache.map((role) => {
          if (role.name === `${ctfName}`) {
            return role.delete();
          }
        });

        interface Message {
          channel: string;
          content: string;
          author: string;
          timestamp: string;
        }

        // put the archive in the archive channel of the ctf in the description
        const niceMessages: string[] = allMessages.map((messages) => {
          let channelName = "";
          let niceMessage = "";

          messages = messages.reverse();

          if (messages.length > 0) {
            channelName = messages[0].channel;
            niceMessage += `## ${channelName}\n`;

            messages.forEach((message: Message) => {
              if (channelName != message.channel) {
                channelName = message.channel;
                niceMessage = `## ${channelName}\n`;
              }

              const timestamp = new Date(message.timestamp).toLocaleString();

              const formattedMessage = `[${timestamp}] ${message.author}: ${message.content}`;
              niceMessage += formattedMessage + "\n";
            });
          }

          return niceMessage;
        });

        // the character limit of a pad is 100000 characters
        // so we need to split the messages in multiple pads
        // and put the links to the other pads in the first pad

        const ctfId = Number(await getCtfIdFromDatabase(ctfName));

        const MAX_PAD_LENGTH = config.pad.documentMaxLength - 100; // some margin to be safe

        const pads = [];
        let currentPadMessages = [];
        let currentPadLength = 0;
        let padIndex = 1;

        for (const message of niceMessages) {
          const messageLength = message.length;

          // If adding the current message exceeds the maximum pad length
          if (currentPadLength + messageLength > MAX_PAD_LENGTH) {
            // Create a new pad
            const padUrl = await createPad(
              `${ctfName} Discord archive (${padIndex})`,
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
          currentPadLength += messageLength;
        }
        let firstPadContent = "";
        if (pads.length > 0) {
          // Create the final pad for the remaining messages
          const padUrl = await createPad(
            `${ctfName} Discord archive (${padIndex})`,
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

        const firstPadUrl = await createPad(
          `${ctfName} Discord archive`,
          firstPadContent
        );

        await createTask(
          `${ctfName} Discord archive`,
          `Discord archive of ${ctfName}`,
          "",
          firstPadUrl,
          ctfId
        );
      }
    }

    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

async function fetchAllMessages(channel: TextBasedChannel): Promise<any> {
  let messages = new Collection<Snowflake, Message>();
  let channelMessages = await channel.messages.fetch({ limit: 100 });
  while (channelMessages.size > 0) {
    messages = messages.concat(channelMessages);
    channelMessages = await channel.messages.fetch({
      limit: 100,
      before: channelMessages.last()!.id,
    });
  }

  const messagesCollection: any[] = [];

  messages.forEach((message: Message) => {
    const channel = message.channel as TextChannel;

    const channelName = channel.name;
    const timestamp = message.createdTimestamp;
    const author = message.author.username;

    let content = "";

    if (message.attachments.size > 0) {
      message.attachments.forEach((attachment) => {
        message.content += attachment.url + " ";
      });
    }

    content += message.content;

    const messageObject = {
      channel: channelName,
      content: content,
      author: author,
      timestamp: timestamp,
    };

    messagesCollection.push(messageObject);
  });

  return messagesCollection; // Return an array of names
}

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  slashCommand.run(client, interaction);
};
