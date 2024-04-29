import { Guild } from "discord.js";
import {
  deleteInvitation,
  getAccessibleCTFsForUser,
  getCtfFromDatabase,
  getInvitedUsersByCtf,
  insertInvitation,
} from "../database/ctfs";
import { getDiscordIdFromUserId, getUserByDiscordId } from "../database/users";
import { changeDiscordUserRoleForCTF } from "../commands/linkUser";
import { PoolClient } from "pg";

export async function syncDiscordPermissionsWithCtf(
  guild: Guild,
  ctfId: bigint,
  discordLink: string | null,
  pgClient: PoolClient
) {
  if (discordLink == null || discordLink.length == 0) {
    return;
  }
  const ctf = await getCtfFromDatabase(ctfId, pgClient);
  if (ctf == null) {
    return;
  }

  const guildEvents = await guild.scheduledEvents.fetch();

  const eventId = discordLink.match(/event=(\d+)/)?.[1];
  if (eventId == null) {
    return;
  }

  const event = guildEvents.get(eventId);
  if (event == null) return;

  const discordUsersInterested = await event.fetchSubscribers();

  const usersInterested = (
    await Promise.all(
      discordUsersInterested.map(async function (user) {
        return await getUserByDiscordId(user.user.id, pgClient);
      })
    )
  ).filter((user) => user != null) as Array<bigint>;

  // search for users that are invited to the CTF but are not interested in the event
  const invitedUsers = await getInvitedUsersByCtf(ctfId, pgClient);
  const usersNotInterested = invitedUsers.filter(
    (user) => !usersInterested.includes(user)
  );

  // remove the role from users that are invited to the CTF but are not interested in the event
  await Promise.all(
    usersNotInterested.map(async function (user) {
      if (user == null) return;
      if ((await getDiscordIdFromUserId(user, pgClient)) == null) return; // don't remove permissions through the Discord sync if the user doesn't have Discord linked
      await deleteInvitation(ctfId, user, pgClient);

      // we just removed the invitation so we expect the user to not have access to the CTF anymore,
      // however if the user has member privileges or higher we do not remove the role because the user should still have access
      const accessibleCTFs = await getAccessibleCTFsForUser(user, pgClient);
      if (accessibleCTFs.find((ctf) => ctf.id === ctfId) != null) {
        return;
      }

      changeDiscordUserRoleForCTF(user, ctf, "remove", pgClient);
    })
  );

  // invite the users that are interested in the event but do not have access yet to the CTF
  return await Promise.all(
    usersInterested.map(async function (user) {
      if (user == null) return;

      insertInvitation(ctfId, user, pgClient);
      // we only add the role if the user also exists in CTFNote and therefore prevent that users only have a Discord account but no CTFNote account
      changeDiscordUserRoleForCTF(user, ctf, "add", pgClient);
    })
  );
}
