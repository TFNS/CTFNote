import { connectToDatabase } from "./database";

export async function getUserByToken(token: string): Promise<bigint | null> {
  const pgClient = await connectToDatabase();

  try {
    const query =
      "SELECT id FROM ctfnote_private.user WHERE token = $1 AND discord_id is NULL LIMIT 1";
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
