import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import validationMiddleware from "../../utils/validation";
import { body } from "express-validator";
import Task from "../../entity/Task";
import CTF from "../../entity/CTF";
import Status from "../../entity/Status";
import { getConnection } from "typeorm";
import logger from "../../config/logger";

const DelStatusAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { ctfSlug, taskSlug, statusId } = req.params;
    const user = SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);
    const taskRepo = getConnection().getRepository(Task);
    const statusRepo = getConnection().getRepository(Status);
    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "tasks.statuses", "tasks.players", "tasks.statuses.user", "guests"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const isGranted = await RightsManager.isGrantedCTF(user, ctf);
    if (!isGranted)
      return res.status(403).json({
        errors: [
          {
            msg: `You are not allowed to access this CTF.`,
          },
        ],
      });

    let task = ctf.tasks.find((t) => t.slug === taskSlug);
    if (!task) return res.status(404).json({ errors: [{ msg: "Invalid Task slug" }] });

    let status = task.statuses.find((status) => status.id == parseInt(statusId));
    if (!status) {
      return res.status(404).json({ errors: [{ msg: "Invalid status id" }] });
    }
    if (status.user.slug != user.slug && RightsManager.isGranted(user, Rights.ADMIN_ALL)) {
      return res.status(403).json({ errors: [{ msg: "Cannot delete someone else's status" }] });
    }

    const idx = task.statuses.findIndex((s) => s.id === status.id);
    task.statuses.splice(idx, 1);

    statusRepo.remove([status]);

    task = await taskRepo.save(task);

    return res.json(task);
  },
};

export default DelStatusAction;
