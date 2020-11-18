import Globals from "../config/globals";
import genUUID from "./uuid";
import User from "../entity/User";
import Session from "../entity/Session";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import signale from "signale";

export default class SessionManager {
  static async generateSession(slug: string): Promise<Session> {
    const uuid = genUUID();

    const sessionRepo = getConnection().getRepository(Session);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + Globals.defaultCookieExpirationTime);

    let session = new Session();

    session.userSlug = slug;
    session.uuid = uuid;
    session.expiresAt = expiresAt;
    try {
      session = await sessionRepo.save(session);
    } catch (e) {
      signale.fatal(e);
    }
    return session;
  }

  static async invalidateSession(uuid: string): Promise<void> {
    const sessionRepo = getConnection().getRepository(Session);

    const session = await sessionRepo.findOne({ uuid });
    if (session) await sessionRepo.delete({ uuid });
  }

  static async checkSession(uuid: string): Promise<User> {
    const sessionRepo = getConnection().getRepository(Session);
    const userRepo = getConnection().getRepository(User);
    const session = await sessionRepo.findOne({ uuid });

    if (!session) return null;

    const now = new Date();
    const expiresAt = session.expiresAt;

    if (expiresAt <= now) {
      await sessionRepo.remove(session);
      return null;
    }
    const user = userRepo.findOne({ slug: session.userSlug });
    return user;
  }

  static async authMiddleware(req: Request, res: Response, next) {
    const uuid = req.cookies[Globals.cookieName];

    const deny = (r: Response) => r.status(403).json({ errors: [{ msg: "Invalid session cookie" }] });

    if (!uuid) return deny(res);

    const user = await SessionManager.checkSession(uuid);

    if (!user) return deny(res);

    // Inject the user in the request
    (req as any).user = user;

    return next();
  }

  static getUser(req: Request): User {
    return (req as any).user;
  }
}
