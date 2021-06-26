import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import CTF from "../../entity/CTF";
import RightsManager from "../../utils/rights";
import { getConnection } from "typeorm";

const GetCTFAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const { slug: ctfSlug } = req.params;

    const user = SessionManager.getUser(req);
    const ctfRepo = getConnection().getRepository(CTF)
    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "guests", "tasks.players", "tasks.statuses", "tasks.statuses.user"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const hasRightToCtf = await RightsManager.isGrantedCTF(user, ctf);
    if (!hasRightToCtf)
      return res.status(403).json({
        errors: [{ msg: `You are not invited to this CTF` }],
      });
    return res.json(ctf);
  },
};

export default GetCTFAction;
