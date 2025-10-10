import axios from "axios";
import config from "../config";

export async function registerAndLoginUser(): Promise<string[]> {
  const username = config.pad.metaUserName;
  const password = config.pad.metaUserPassword;

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