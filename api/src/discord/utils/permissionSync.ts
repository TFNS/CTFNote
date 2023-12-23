import { Guild } from "discord.js";
import { getCtfFromDatabase, insertInvitation } from "../database/ctfs";
import { getUserByDiscordId } from "../database/users";
import { changeDiscordUserRoleForCTF } from "../commands/linkUser";

export async function syncDiscordPermissionsWithCtf(
  guild: Guild,
  ctfId: bigint,
  discordLink: string | null
) {
  if (discordLink == null || discordLink.length == 0) return;
  const ctf = await getCtfFromDatabase(ctfId);
  if (ctf == null) return;

  const guildEvents = await guild.scheduledEvents.fetch();

  const eventId = discordLink.match(/event=(\d+)/)?.[1];
  if (eventId == null) return;

  const event = guildEvents.get(eventId);
  if (event == null) return;

  const discordUsersInterested = await event.fetchSubscribers();

  const usersInterested = await Promise.all(
    discordUsersInterested.map(async function (user) {
      return await getUserByDiscordId(user.user.id);
    })
  );
  await Promise.all(
    usersInterested.map(async function (user) {
      if (user == null) return;
      insertInvitation(ctfId, user);
      // we only add the role if the user also exists in CTFNote and therefore prevent that users only have a Discord account but no CTFNote account
      changeDiscordUserRoleForCTF(user, ctf, "add");
    })
  );
}
