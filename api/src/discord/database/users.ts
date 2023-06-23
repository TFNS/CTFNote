import { connectToDatabase } from "./database";

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

export async function getUserByDiscordId(
  discordId: string
): Promise<bigint | null> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT id FROM ctfnote.profile WHERE discord_id = $1 LIMIT 1";
    const values = [discordId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].id as bigint;
  } catch (error) {
    return null;
  } finally {
    pgClient.release();
  }
}

export async function getDiscordIdFromUserId(userId: bigint): Promise<string> {
  const pgClient = await connectToDatabase();
  try {
    const query = "SELECT discord_id FROM ctfnote.profile WHERE id = $1";
    const values = [userId];
    const queryResult = await pgClient.query(query, values);

    return queryResult.rows[0].discord_id as string;
  } catch (error) {
    return "";
  } finally {
    pgClient.release();
  }
}
