import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import RightsManager from "../../utils/rights";
import validationMiddleware from "../../utils/validation";
import { body } from "express-validator";
import logger from "../../config/logger";
import Task from "../../entity/Task";
import CTF from "../../entity/CTF";
import { getConnection } from "typeorm";

const UpdateTaskAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    body("solved").optional().isBoolean(),
    body("title").optional().isString(),
    body("category").optional().isString(),
    body("description").optional().isString(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { ctfSlug, taskSlug } = req.params;
    const user = SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);
    const taskRepo = getConnection().getRepository(Task);
    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "tasks.players", "guests"] });
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

    for (const field of ["solved", "title", "category", "description", "flag"]) {
      if (field in req.body) {
        task[field] = req.body[field];
      }
    }

    try {
      task = await taskRepo.save(task);
    } catch (e) {
      logger.warn(`Could not update task '${taskSlug}': `);
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ msg: `Could not update the task, contact administrator` }],
      });
    }

    return res.json(task);
  },
};

export default UpdateTaskAction;
