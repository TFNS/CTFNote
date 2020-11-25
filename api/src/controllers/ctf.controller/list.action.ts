import CTF from "../../entity/CTF";
import { Request, Response } from "express";
import { getRepository, LessThan, MoreThan } from "typeorm";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import Globals from "../../config/globals";

const ListCTFAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const { filter, p } = req.query;

    const ctfRepo = getRepository(CTF);

    let page = 0;

    if (p) page = parseInt(p.toString(), 10);

    const now = new Date();
    let ctfs;
    switch (filter) {
      case "past":
        ctfs = await ctfRepo.find({
          relations: ["guests"],
          where: { finish: LessThan(now) },
          skip: Globals.maxCtfPerPage * page,
          take: Globals.maxCtfPerPage,
          order: { finish: "DESC" },
        });
        break;
      case "calendar":
        ctfs = await ctfRepo.find({
          relations: ["guests"],
          skip: Globals.maxCtfPerPage * page,
          take: Globals.maxCtfPerPage,
          order: { finish: "DESC" },
        });
        break;
      case "incoming": // Get running and incoming
      default:
        ctfs = await ctfRepo.find({
          relations: ["guests"],
          where: { finish: MoreThan(now) },
          order: { start: "ASC" },
        });
        break;
    }

    const user = SessionManager.getUser(req);

    ctfs.forEach((ctf: CTF) => ctf.addGranted(user));

    return res.status(200).json(ctfs);
  },
};

export default ListCTFAction;
