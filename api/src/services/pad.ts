import Axios from "axios";
import logger from "../config/logger";
import PersistentConfiguration from "../config/persitent";
import querystring from "querystring";
import Globals from "../config/globals";

export default class PadService {
  /**
   * Creates a pad on the configured pad provided
   */
  static async create(): Promise<string> {
    const createUrl = await PersistentConfiguration.get("md-create-url");
    const showUrl = await PersistentConfiguration.get("md-show-url");
    try {
      const res = await Axios.get(createUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      });

      return `${showUrl === "/" ? "" : showUrl}${res.headers.location}`;
    } catch (e) {
      logger.warn(`Could not generate new pad from '${createUrl}': `);
      logger.fatal(e);
      return "#";
    }
  }

  private static async baseUrl(): Promise<string> {
    let cleanUrl: string = await PersistentConfiguration.get("md-create-url");
    cleanUrl = cleanUrl.slice(0, -4); //remove '/new' for clean url
    return cleanUrl;
  }

  private static async authPad(username: string, password: string, url: URL): Promise<string> {
    if (!Globals.hedgedocAuth) {
      return null;
    }

    let domain: string;
    //if domain does not end in '.[tld]', it will be rejected
    //so we add '.local' manually
    if (url.hostname.split(".").length == 1) {
      domain = `${url.hostname}.local`;
    } else {
      domain = url.hostname;
    }

    const email = `${username}@${domain}`;

    try {
      const res = await Axios.post(
        url.toString(),
        querystring.stringify({
          email: email,
          password: password,
        }),
        {
          validateStatus: (status) => status === 302,
          maxRedirects: 0,
          timeout: 5000,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      return res.headers["set-cookie"];
    } catch (e) {
      logger.warn(`Could not auth to pad service: '${url.toString()}': `);
      logger.fatal(e);
      return null;
    }
  }

  static async register(username: string, password: string): Promise<string> {
    const authUrl = new URL(`${await this.baseUrl()}/register`);
    return this.authPad(username, password, authUrl);
  }

  static async login(username: string, password: string): Promise<string> {
    const authUrl = new URL(`${await this.baseUrl()}/login`);
    return this.authPad(username, password, authUrl);
  }
}
