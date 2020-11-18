import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";

const MeAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const user = SessionManager.getUser(req);

    return res.json({
      ...user,
      ...{ password: null },
    });
  },
};

export default MeAction;
