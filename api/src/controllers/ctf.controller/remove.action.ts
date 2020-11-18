import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import CTF from "../../entity/CTF";
import { getConnection } from "typeorm";
import Task from "../../entity/Task";

const RemoveCTFAction: IRoute = {
  middlewares: [SessionManager.authMiddleware, RightsManager.grantMiddleware([Rights.EDIT_CTF])],
  async action(req: Request, res: Response, next) {
    const { slug: ctfSlug } = req.params;

    const user = await SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);

    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "guests"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const taskRepo = getConnection().getRepository(Task);

    const isGranted = await RightsManager.isGrantedCTF(user, ctf);
    if (!isGranted)
      return res.status(403).json({
        errors: [
          {
            msg: `You are not allowed to access this CTF.`,
          },
        ],
      });

    const tasks = await taskRepo.find({ ctf });
    for (const task of tasks) {
      await taskRepo.remove(task);
    }

    await ctfRepo.remove(ctf);

    return res.status(204).send();
  },
};

export default RemoveCTFAction;
