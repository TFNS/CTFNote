import { Request, Response } from "express";
import PersistentConfiguration from "../../config/persitent";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const GetSettingsAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const config = await PersistentConfiguration.list(false);
    return res.json(config);
  },
};

export default GetSettingsAction;
