import axios from "axios";
import { connectToDatabase } from "./database";
import config from "../config";

export async function getPassword(): Promise<string | null> {
  const pgClient = await connectToDatabase();
  try {
    const result = await pgClient.query(
      "SELECT hedgedoc_meta_user_password FROM ctfnote.settings LIMIT 1"
    );
    if (result.rows.length > 0) {
      return result.rows[0].hedgedoc_meta_user_password || null;
    }
    return null;
  } catch (error) {
    console.error("Failed to get HedgeDoc password:", error);
    throw error;
  } finally {
    pgClient.release();
  }
}

export async function initHedgedocPassword(): Promise<string> {
  const pgClient = await connectToDatabase();
  const pw = await getPassword();

  if (pw !== null) {
    return pw;
  }

  const password = [...Array(128)]
    .map(() =>
      String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33)
    )
    .join("");

  try {
    const query =
      "UPDATE ctfnote.settings SET hedgedoc_meta_user_password = $1";
    const values = [password];
    await pgClient.query(query, values);
    return password;
  } catch (error) {
    console.error(
      "Failed to set hedgedoc_nonpublic_pads flag in the database:",
      error
    );
    throw error;
  } finally {
    pgClient.release();
  }
}

export async function registerAndLoginUser(): Promise<string[]> {
  const username = config.pad.metaUserName;
  const password = getPassword(); //TODO cache somehow

  try {
    await axios.post(
      "http://hedgedoc:3000/register",
      `email=${username}&password=${password}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          Priority: "u=4",
        },
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: (status: number) =>
          status === 200 || status === 409 || status === 302, // 409 if already exists
      }
    );

    const loginResponse = await axios.post(
      "http://hedgedoc:3000/login",
      `email=${username}&password=${password}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          Priority: "u=4",
        },
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: (status: number) => status === 200 || status === 302,
      }
    );

    const setCookieHeader = loginResponse.headers["set-cookie"];
    return setCookieHeader ?? [];
  } catch (error) {
    throw Error(
      `Login to hedgedoc during task creation failed. Error: ${error}`
    );
  }
}
