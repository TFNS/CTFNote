import { Request, Response } from "express";
import { body } from "express-validator";
import Globals from "../../config/globals";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";

import makeSlug from "../../utils/slugify";
import User from "../../entity/User";
import PasswordUtil from "../../utils/password";

import authLimiter from "../../ratelimits/auth";
import { getConnection } from "typeorm";
import SessionManager from "../../utils/session";

function deny(res: Response) {
  return res.status(403).json({ errors: [{ msg: `Invalid username/password` }] });
}

const LoginAction: IRoute = {
  middlewares: [
    body("username").isString().isLength({
      min: Globals.usernameMinLength,
      max: Globals.usernameMaxLength,
    }),
    body("password").isString(),
    validationMiddleware,
    Globals.env === "dev" ? (_, __, next) => next() : authLimiter,
  ],
  async action(req: Request, res: Response, next) {
    const { username, password } = req.body;
    const slug = makeSlug(username);

    const userRepo = getConnection().getRepository(User);

    const user = await userRepo.findOne({ slug }, { select: ["password", "username", "slug", "rights"] });

    if (!user) return deny(res);

    const granted = await PasswordUtil.compare(password, user.password);

    if (!granted) return deny(res);

    const session = await SessionManager.generateSession(slug);

    if (!session) return deny(res);

    res.cookie(Globals.cookieName, session.uuid, {
      expires: session.expiresAt,
      httpOnly: true,
    });

    return res.json({
      message: null,
      cookie: session.uuid,
      user: { ...user, ...{ password: null } },
    });
  },
};

export default LoginAction;
