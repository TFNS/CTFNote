import { getDiscordGuild } from "..";
import { getNameFromUserId } from "../database/ctfs";
import { getDiscordIdFromUserId } from "../database/users";

export async function convertToUsernameFormat(userId: bigint | string) {
  // this is actually the Discord ID and not a CTFNote userId
  if (typeof userId === "string") {
    // but if somehow it's not, just return it
    if (isNaN(parseInt(userId))) return userId;
    return `<@${userId}>`;
  }

  const name = await getNameFromUserId(userId);
  if (name == null) return name;

  const discordId = await getDiscordIdFromUserId(userId);
  if (discordId == null) return name;

  const guild = getDiscordGuild();
  if (guild == null) return name;

  const member = await guild.members.fetch({ user: discordId });
  if (member == null) return name;

  if (member.displayName.toLowerCase() !== name.toLowerCase()) {
    return `${member.user} (${name})`;
  } else {
    return `${member.user}`;
  }
}
