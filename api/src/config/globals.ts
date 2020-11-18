import PersistentConfiguration from "./persitent";
import Rights from "./rights";

import fs from "fs/promises";
import path from "path";

export default class Globals {
  static port = 31337;
  static version = "v1.0.0";
  static appName = "ctfnote-api";

  static env = process.env.NODE_ENV || "dev";

  static usernameMinLength = 1;
  static usernameMaxLength = 32;

  static defaultCookieExpirationTime = 10; // in days
  static cookieName = "ctfnote-auth";
  static userAgent = "CTFNote";

  static adminRights = [Rights.ADMIN_ALL];
  static defaultRights = [];

  static allowRegistration = true;

  static mdCreateUrl = process.env.MD_CREATE_URL || "http://front/pad/new";
  static mdShowUrl = process.env.MD_SHOW_URL || "/pad";

  static maxCtfPerPage = 20;

  static updatableFields = {
    ctf: ["ctfUrl", "start", "finish", "logo", "ctfTimeUrl", "format", "url", "description"],
  };

  static logo = "";

  static async getLogo() {
    const location = path.join(__dirname, "../logo/logo.png");
    const data = await fs.readFile(location, "base64");
    const url = `data:image/png;base64,${data}`;

    return url;
  }

  static async init() {
    Globals.mdCreateUrl = await PersistentConfiguration.setIfNotSet("md-create-url", Globals.mdCreateUrl);
    Globals.mdShowUrl = await PersistentConfiguration.setIfNotSet("md-show-url", Globals.mdShowUrl);
    Globals.allowRegistration = await PersistentConfiguration.setIfNotSet(
      "allow-registration",
      Globals.allowRegistration
    );
  }
}
