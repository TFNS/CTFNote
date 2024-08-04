import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  GuildMemberRoleManager,
} from "discord.js";
import { Command } from "../command";
import {
  AllowedRoles,
  createInvitationTokenForDiscordId,
  getInvitationTokenForDiscordId,
  getUserByDiscordId,
} from "../database/users";
import config from "../../config";

async function getInvitationUrl(invitationCode: string | null = null) {
  if (config.pad.domain == "") return null;
  if (invitationCode == null) return null;

  const ssl = config.pad.useSSL == "false" ? "" : "s";

  return `http${ssl}://${config.pad.domain}/#/auth/register/${invitationCode}`;
}

async function createAccountLogic(
  client: Client,
  interaction: CommandInteraction
) {
  if (config.discord.registrationEnabled.toLowerCase() === "false") {
    await interaction.editReply({
      content:
        "The functionality to create your own account this way has been disabled by an administrator.",
    });
    return;
  }

  if (config.discord.registrationRoleId !== "") {
    if (
      !(interaction.member?.roles as GuildMemberRoleManager).cache.has(
        config.discord.registrationRoleId
      )
    ) {
      await interaction.editReply({
        content:
          "You do not have the role required to create an account yourself.",
      });
      return;
    }
  }

  const userId = await getUserByDiscordId(interaction.user.id);
  if (userId != null) {
    await interaction.editReply({
      content:
        "You can't link the same Discord account twice! If you do not have a CTFNote account or haven't linked it, contact an administrator.",
    });
    return;
  }

  const existingInvitationCode = await getInvitationTokenForDiscordId(
    interaction.user.id
  );
  if (existingInvitationCode != null) {
    const invitationUrl = await getInvitationUrl(existingInvitationCode);
    if (invitationUrl == null) {
      await interaction.editReply({
        content: "Something went wrong.", // TODO: Meaningful error messages?
      });
      return;
    }

    await interaction.editReply({
      content: `Your personal invitation url: ${invitationUrl}. If you already have a CTFNote account you should link it using the /link command instead.`,
    });
    return;
  }

  await interaction.editReply({
    content:
      "Generating private invitation url... If you already have a CTFNote account you should link it using the /link command instead.",
  });

  const invitationCode = await createInvitationTokenForDiscordId(
    interaction.user.id,
    (config.discord.registrationAccountRole as AllowedRoles) ??
      AllowedRoles.user_guest
  );

  if (invitationCode == null) {
    await interaction.editReply({
      content: "Something went wrong.", // TODO: Meaningful error messages?
    });
    return;
  }

  const invitationUrl = await getInvitationUrl(invitationCode);
  if (invitationUrl == null) {
    await interaction.editReply({
      content: "Something went wrong.", // TODO: Meaningful error messages?
    });
    return;
  }

  await interaction.editReply({
    content: `Your personal invitation url: ${invitationUrl}. If you already have a CTFNote account you should link it using the /link command instead.`,
  });
  return;
}

export const Register: Command = {
  name: "register",
  description: "Create an account on CTFNote if you are allowed to!",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    return createAccountLogic(client, interaction).catch((e) => {
      console.error("Error during register logic: ", e);
    });
  },
};
