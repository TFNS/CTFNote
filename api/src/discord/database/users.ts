import { connectToDatabase } from "./database";
import { PoolClient } from "pg";

/*
 * Only returns users that have not linked their discord account yet.
 */
export async function getUserByToken(token: string): Promise<bigint | null> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT u.id FROM ctfnote_private.user as u JOIN ctfnote.profile as profile ON u.id = profile.id WHERE u.token = $1 AND discord_id is NULL LIMIT 1";
    const values = [token];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].id as bigint;
  } catch (error) {
    return null;
  } finally {
    pgClient.release();
  }
}

export async function setDiscordIdForUser(
  userId: bigint,
  discordId: string
): Promise<boolean> {
  const pgClient = await connectToDatabase();

  try {
    const query = "UPDATE ctfnote.profile SET discord_id = $2 WHERE id = $1";
    const values = [userId, discordId];
    const result = await pgClient.query(query, values);
    return result.rowCount == 1;
  } catch (error) {
    console.error(
      "Failed to set discord id for user in the database:",
      error,
      userId,
      discordId
    );
    return false;
  } finally {
    pgClient.release();
  }
}

// refactor above to an enum
export enum AllowedRoles {
  user_guest = "user_guest",
  user_friend = "user_friend",
  user_member = "user_member",
  user_manager = "user_manager",
  user_admin = "user_admin",
}

export async function getInvitationTokenForDiscordId(
  discordId: string,
  pgClient: PoolClient | null = null
): Promise<string | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT token FROM ctfnote_private.invitation_link WHERE discord_id = $1";
    const values = [discordId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].token as string;
  } catch (error) {
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function createInvitationTokenForDiscordId(
  discordId: string,
  role: AllowedRoles = AllowedRoles.user_guest,
  pgClient: PoolClient | null = null
): Promise<string | null> {
  role = (role as AllowedRoles) ?? AllowedRoles.user_guest;

  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query = "SELECT token FROM ctfnote.create_invitation_link($1, $2)";
    const values = [role, discordId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].token as string;
  } catch (error) {
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function getUserByDiscordId(
  discordId: string,
  pgClient: PoolClient | null = null
): Promise<bigint | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT id FROM ctfnote.profile WHERE discord_id = $1 LIMIT 1";
    const values = [discordId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].id as bigint;
  } catch (error) {
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function getDiscordIdFromUserId(
  userId: bigint,
  pgClient: PoolClient | null = null
): Promise<string | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();
  try {
    const query = "SELECT discord_id FROM ctfnote.profile WHERE id = $1";
    const values = [userId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].discord_id as string;
  } catch (error) {
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}

export async function getDiscordUsersThatCanPlayCTF(
  ctfId: bigint
): Promise<string[]> {
  const pgClient = await connectToDatabase();
  try {
    const query =
      "SELECT discord_id FROM ctfnote_private.discord_users_can_play_ctf($1)";
    const values = [ctfId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows.map((row) => row.discord_id);
  } catch (error) {
    console.error(
      "Failed to fetch discord users that can play ctf from the database:",
      error
    );
    return [];
  } finally {
    pgClient.release();
  }
}

export async function getUserIdFromUsername(
  username: string,
  pgClient: PoolClient | null = null
): Promise<bigint | null> {
  const useRequestClient = pgClient != null;
  if (pgClient == null) pgClient = await connectToDatabase();

  try {
    const query = "SELECT id FROM ctfnote.profile WHERE username = $1";
    const values = [username];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].id as bigint;
  } catch (error) {
    return null;
  } finally {
    if (!useRequestClient) pgClient.release();
  }
}
