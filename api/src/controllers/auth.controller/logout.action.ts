import { Request, Response } from "express";
import { body } from "express-validator";
import IRoute from "../route";
import SessionManager from "../../utils/session";
import validationMiddleware from "../../utils/validation";
import Globals from "../../config/globals";

const LogoutAction: IRoute = {
  middlewares: [SessionManager.authMiddleware, body("logout").isBoolean(), validationMiddleware],
  async action(req: Request, res: Response, next) {
    const { logout } = req.body;

    if (logout) await SessionManager.invalidateSession(req.cookies[Globals.cookieName]);

    res.clearCookie(Globals.hedgedocCookieName);
    return res.status(204).send();
  },
};

export default LogoutAction;
