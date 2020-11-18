import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import CTF from "../../entity/CTF";
import Task from "../../entity/Task";
import RightsManager from "../../utils/rights";
import logger from "../../config/logger";
import { getConnection } from "typeorm";

const RemoveTaskAction: IRoute = {
  middlewares: [SessionManager.authMiddleware],
  async action(req: Request, res: Response, next) {
    const { ctfSlug, taskSlug } = req.params;

    const user = SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);
    const taskRepo = getConnection().getRepository(Task);
    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "guests"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const isGranted = RightsManager.isGrantedCTF(user, ctf);
    if (!isGranted)
      return res.status(403).json({
        errors: [
          {
            msg: `You are not allowed to access this CTF.`,
          },
        ],
      });

    const task = ctf.tasks.find((t) => t.slug === taskSlug);
    if (!task) return res.status(404).json({ errors: [{ msg: "Invalid Task slug" }] });

    try {
      await taskRepo.remove(task);
    } catch (e) {
      logger.warn("Could not remove the task:");
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ msg: `Could not remove the task, contact administrator` }],
      });
    }

    return res.status(204).send();
  },
};

export default RemoveTaskAction;
