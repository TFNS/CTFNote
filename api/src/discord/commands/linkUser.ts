import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
} from "discord.js";
import { Command } from "../command";
import {
  getDiscordIdFromUserId,
  getUserByToken,
  setDiscordIdForUser,
} from "../database/users";
import { CTF, getAccessibleCTFsForUser } from "../database/ctfs";
import { getDiscordClient } from "..";
import config from "../../config";

export async function changeDiscordUserRoleForCTF(
  userId: bigint,
  ctf: CTF | string | string[],
  operation: "add" | "remove"
): Promise<boolean> {
  const discordUserId = await getDiscordIdFromUserId(userId);
  if (discordUserId == null) return false;

  const discordClient = getDiscordClient();
  if (!discordClient) return false;

  const guild = discordClient.guilds.resolve(config.discord.serverId);

  let ctfTitle: string[] = [];
  if (typeof ctf === "string") {
    ctfTitle = [ctf];
  } else if (Array.isArray(ctf)) {
    ctfTitle = ctf;
  } else {
    ctfTitle = [ctf.title];
  }

  const member = await guild?.members.fetch(discordUserId);
  if (!member) return false;

  for (const c of ctfTitle) {
    const role = guild?.roles.cache.find((role) => role.name === c);
    if (!role) return false;

    if (operation === "add") {
      await member.roles.add(role);
    } else if (operation === "remove") {
      await member.roles.remove(role);
    }
  }

  return true;
}

export const LinkUser: Command = {
  name: "link",
  description: "Connect your Discord account to your CTFNote account!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "token",
      required: true,
      description: "Your CTFNote account token (found in your profile)",
      type: ApplicationCommandOptionType.String,
      minLength: 1,
    },
  ],
  run: async (_client: Client, interaction: CommandInteraction) => {
    const token = interaction.options.get("token", true).value as string;

    const userId = await getUserByToken(token);

    if (!userId) {
      await interaction.editReply({
        content: "No account with such token found that is not already linked!",
      });
      return;
    }

    const discordId = interaction.user.id;

    const success = await setDiscordIdForUser(userId, discordId);

    if (!success) {
      await interaction.editReply({
        content:
          "You can't link the same Discord account twice! Please use a different Discord account or investigate why your account is already linked.",
      });
      return;
    }

    await interaction.editReply({
      content:
        "Successfully linked your Discord account to your CTFNote account!",
    });

    const ctfs = await getAccessibleCTFsForUser(userId);

    ctfs.forEach(function (ctf) {
      changeDiscordUserRoleForCTF(userId, ctf, "add");
    });
  },
};
