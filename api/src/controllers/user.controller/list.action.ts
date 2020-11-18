import { Request, Response } from "express";
import User from "../../entity/User";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import { getConnection } from "typeorm";

const ListUserAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const userRepo = getConnection().getRepository(User)
    const users = await userRepo.find();
    return res.json(users);
  },
};

export default ListUserAction;
