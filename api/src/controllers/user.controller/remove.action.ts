import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import User from "../../entity/User";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import logger from "../../config/logger";
import { getConnection } from "typeorm";

const RemoveUserAction: IRoute = {
  middlewares: [SessionManager.authMiddleware, RightsManager.grantMiddleware([Rights.ADMIN_ALL])],
  async action(req: Request, res: Response, next) {
    const { slug: userSlug } = req.params;

    const currentUser = SessionManager.getUser(req);

    const userRepo = getConnection().getRepository(User);
    const user = await userRepo.findOne({ slug: userSlug });

    if (!user) return res.status(404).json({ errors: [{ msg: "Invalid user slug" }] });
    if (user.slug === currentUser.slug) {
      return res.status(400).json({ errors: [{ msg: "You cannot delete yourself." }] });
    }

    try {
      await userRepo.remove(user);
    } catch (e) {
      logger.warn("Could not remove the user:");
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ msg: `Could not remove the user, contact administrator` }],
      });
    }
    return res.status(204).json();
  },
};

export default RemoveUserAction;
