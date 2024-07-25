import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  GuildMemberRoleManager,
} from "discord.js";
import { Command } from "../command";
import {
  createInvitationTokenForDiscordId,
  getInvitationTokenForDiscordId,
  getUserByDiscordId,
} from "../database/users";
import config from "../../config";

async function getInvitationUrl(invitation_code: string | null = null) {
  if (config.pad.domain == "") return "";
  if (invitation_code == null) return "";

  const ssl = config.pad.useSSL == "false" ? "" : "s";

  return `http${ssl}://${config.pad.domain}/#/auth/register/${invitation_code}`;
}

//? Refactor this to not have this type in two places.
type AllowedRoles =
  | "user_guest"
  | "user_friend"
  | "user_member"
  | "user_manager"
  | "user_admin";

async function createAccountLogic(
  client: Client,
  interaction: CommandInteraction
) {
  if (config.discord.registrationEnabled.toLowerCase() === "false") {
    await interaction.editReply({
      content:
        "The functionality to create your own account this way has been disabled by an administrator",
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

  const existing_invitation_code = await getInvitationTokenForDiscordId(
    interaction.user.id
  );
  if (existing_invitation_code != null) {
    const invitation_url = await getInvitationUrl(existing_invitation_code);
    if (invitation_url == "") {
      await interaction.editReply({
        content: "Something went wrong.", // TODO: Meaningful error messages?
      });
      return;
    }

    await interaction.editReply({
      content: `Your personal invitation url: ${invitation_url}. If you already have a CTFNote account you should link it using the /link command instead.`,
    });
    return;
  }

  await interaction.editReply({
    content:
      "Generating private invitation url... If you already have a CTFNote account you should link it using the /link command instead.",
  });

  const invitation_code = await createInvitationTokenForDiscordId(
    (config.discord.registrationAccountRole as AllowedRoles) ?? "user_guest",
    interaction.user.id
  );

  if (invitation_code == null) {
    await interaction.editReply({
      content: "Something went wrong.", // TODO: Meaningful error messages?
    });
    return;
  }

  const invitation_url = await getInvitationUrl(invitation_code);
  if (invitation_url == "") {
    await interaction.editReply({
      content: "Something went wrong.", // TODO: Meaningful error messages?
    });
    return;
  }

  await interaction.editReply({
    content: `Your personal invitation url: ${invitation_url}. If you already have a CTFNote account you should link it using the /link command instead.`,
  });
  return;
}

export const Register: Command = {
  name: "register",
  description:
    "Create an account on the CTFNote platform if you are allowed to!",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    return createAccountLogic(client, interaction).catch((e) => {
      console.error("Error during register logic: ", e);
    });
  },
};
