import { Request, Response } from "express";
import Globals from "../../config/globals";
import PersistentConfiguration from "../../config/persitent";
import IRoute from "../route";

const IndexAction: IRoute = {
  middlewares: [],
  async action(req: Request, res: Response, next) {
    return res.json({
      version: Globals.version,
      name: await PersistentConfiguration.get("app-name"),
    });
  },
};

export default IndexAction;
