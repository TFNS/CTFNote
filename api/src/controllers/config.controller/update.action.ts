import { Request, Response } from "express";
import { body } from "express-validator";
import PersistentConfiguration from "../../config/persitent";
import Rights from "../../config/rights";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const UpdateConfigAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.ADMIN_ALL]),
    body("md-create-url").optional(),
    body("md-show-url").optional(),
    body("allow-registration").optional().isBoolean(),
  ],
  async action(req: Request, res: Response, next) {
    const {
      "md-create-url": mdCreateUrl,
      "md-show-url": mdShowUrl,
      "allow-registration": allowRegistration,
      "hedgedoc-auth": hedgedocAuth,
    } = req.body;

    if (mdCreateUrl != null) await PersistentConfiguration.set("md-create-url", mdCreateUrl);
    if (mdShowUrl != null) await PersistentConfiguration.set("md-show-url", mdShowUrl);
    if (allowRegistration != null) await PersistentConfiguration.set("allow-registration", allowRegistration);
    if (hedgedocAuth != null) await PersistentConfiguration.set("hedgedoc-auth", hedgedocAuth);

    return res.status(200).json(await PersistentConfiguration.list());
  },
};

export default UpdateConfigAction;
