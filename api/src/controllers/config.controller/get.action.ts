import { Request, Response } from "express";
import PersistentConfiguration from "../../config/persitent";
import Rights from "../../config/rights";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const GetConfigAction: IRoute = {
  middlewares: [SessionManager.authMiddleware, RightsManager.grantMiddleware([Rights.ADMIN_ALL])],
  async action(req: Request, res: Response, next) {
    const config = await PersistentConfiguration.list();
    return res.json(config);
  },
};

export default GetConfigAction;
