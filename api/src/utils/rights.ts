import { Request, Response } from "express";
import logger from "../config/logger";
import Rights from "../config/rights";
import User from "../entity/User";
import CTF from "../entity/CTF";
import SessionManager from "./session";

const deny = (res: Response) => res.status(403).json({ errors: [{ msg: "Access Denied" }] });

export default class RightsManager {
  static isGranted(user: User, right: string): boolean {
    // Don't fuck with the admin
    if (user.rights.includes(Rights.ADMIN_ALL)) {
      return true;
    }

    return user.rights.includes(right);
  }

  static grantMiddleware(rights: string[]) {
    return async (req: Request, res: Response, next) => {
      const user = SessionManager.getUser(req);

      if (!user) return deny(res);

      for (const right of rights) {
        if (!RightsManager.isGranted(user, right)) {
          logger.warn(`User not granted to right: '${right}'`);
          return deny(res);
        }
      }

      return next();
    };
  }

  static isGrantedCTF(user: User, ctf: CTF): boolean {
    if (RightsManager.isGranted(user, Rights.CTF_ALL)) return true;

    return ctf.guests && !!ctf.guests.find((u) => u.slug === user.slug);
  }
}
