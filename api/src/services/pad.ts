import Axios from "axios";
import logger from "../config/logger";
import PersistentConfiguration from "../config/persitent";

export default class PadService {
  /**
   * Creates a pad on the configured pad provided
   */
  static async create(): Promise<string> {
    const createUrl = await PersistentConfiguration.get("md-create-url");
    let showUrl = await PersistentConfiguration.get("md-show-url");

    try {
      const res = await Axios.get(createUrl, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      });

      if (showUrl === "/") return res.headers.location;

      return showUrl.replace(/\/+$/g, "") + res.headers.location;
    } catch (e) {
      logger.warn(`Could not generate new pad from '${createUrl}': `);
      logger.fatal(e);
      return "#";
    }
  }
}
