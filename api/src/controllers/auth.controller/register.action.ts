import { Request, Response } from "express";
import { body } from "express-validator";
import Globals from "../../config/globals";
import validationMiddleware from "../../utils/validation";
import { getConnection } from "typeorm";
import IRoute from "../route";

import User from "../../entity/User";
import PasswordUtil from "../../utils/password";
import authLimiter from "../../ratelimits/auth";

import makeSlug from "../../utils/slugify";
import SessionManager from "../../utils/session";
import Rights from "../../config/rights";
import PersistentConfiguration from "../../config/persitent";

const RegisterAction: IRoute = {
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
    if (!(await PersistentConfiguration.get("allow-registration")))
      return res.status(402).json({
        errors: [
          {
            msg: "The registration process is disabled, contact the administrator",
          },
        ],
      });

    const { username, password } = req.body;

    const slug = makeSlug(username);

    const userRepo = getConnection().getRepository(User);
    const hash = await PasswordUtil.hash(password);

    const firstAccount = (await userRepo.count()) === 0;
    let user = userRepo.create({ username, slug, password: hash, rights: firstAccount ? Globals.adminRights : Globals.defaultRights, externalAuth:false });

    try {
      user = await userRepo.save(user);
    } catch (e) {
      return res.status(409).json({ errors: [{ msg: "A user with that username already exists" }] });
    }

    const session = await SessionManager.generateSession(user.slug);
    res.cookie(Globals.cookieName, session.uuid, {
      expires: session.expiresAt,
    });

    return res.json({
      message: null,
      cookie: session.uuid,
      user,
    });
  },
};

export default RegisterAction;
