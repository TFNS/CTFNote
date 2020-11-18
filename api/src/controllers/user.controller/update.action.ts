import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import User from "../../entity/User";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import validationMiddleware from "../../utils/validation";
import PasswordUtil from "../../utils/password";
import { body } from "express-validator";
import logger from "../../config/logger";
import { getConnection } from "typeorm";

const UpdateUserAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.ADMIN_ALL]),
    body("username").optional().isString(),
    body("password").optional().isString(),
    body("rights").optional().isArray(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { slug: userSlug } = req.params;

    const updateRequest = {};

    logger.debug(`Editing the following User fields: ${Object.keys(updateRequest)}`);

    const userRepo = getConnection().getRepository(User);

    let user = await userRepo.findOne({ slug: userSlug });
    if (!user) return res.status(404).json({ errors: [{ msg: "Invalid User slug" }] });

    for (const field of ["username", "password", "rights"]) {
      if (field in req.body) {
        if (field === "password") {
          user[field] = await PasswordUtil.hash(req.body[field]);
        } else {
          user[field] = req.body[field];
        }
      }
    }
    try {
      user = await userRepo.save(user);
    } catch (e) {
      logger.warn(`Could not update user '${userSlug}': `);
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ msg: `Could not update the user, contact administrator` }],
      });
    }

    return res.json({ ...user, ...{ password: null } });
  },
};

export default UpdateUserAction;
