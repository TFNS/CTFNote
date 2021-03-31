import { Request, Response } from "express";
import PersistentConfiguration from "../../config/persitent";
import Rights from "../../config/rights";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const GetConfigAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const user = SessionManager.getUser(req);
    const isAdmin = RightsManager.isGranted(user, Rights.ADMIN_ALL)

    const config = await PersistentConfiguration.list(isAdmin);

    return res.json(config);
  },
};

export default GetConfigAction;
