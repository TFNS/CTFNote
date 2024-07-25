import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "../command";
import {
  createInvitationURLForDiscordId,
  getUserByDiscordId,
} from "../database/users";
import config from "../../config";

async function getInvitationUrl(invitation_code: string | null = null) {
  if (config.pad.domain == "") return "";

  if (invitation_code == null) return "";

  const ssl = config.pad.useSSL == "false" ? "" : "s";

  return `http${ssl}://${config.pad.domain}/#/auth/register/${invitation_code}`;
}

async function createAccountLogic(
  client: Client,
  interaction: CommandInteraction
) {
  // TODO: check if user has role
  // TODO: check if feature is enabled in environment variables

  const userId = await getUserByDiscordId(interaction.user.id);
  if (userId != null) {
    await interaction.editReply({
      content:
        "You can't link the same Discord account twice! If you do not have a CTFNote account or haven't linked it, contact an administrator.",
    });
    return;
  }

  await interaction.editReply({
    content:
      "Generating private invitation url... If you already have a CTFNote account you should link it using the /link command instead.",
  });

  const invitation_code = await createInvitationURLForDiscordId(
    "user_friend", // TODO: use environment variable
    interaction.user.id
  );

  if (invitation_code == null) {
    await interaction.editReply({
      content: "Something went wrong.", // TODO: Meaningful error messages?
    });
    return;
  }

  const invitation_url = await getInvitationUrl(invitation_code);
  if (invitation_url == null) {
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
