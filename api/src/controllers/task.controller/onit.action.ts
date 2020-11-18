import { Request, Response } from "express";
import { body } from "express-validator";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";
import Task from "../../entity/Task";
import CTF from "../../entity/CTF";
import { getConnection } from "typeorm";

const OnItAction: IRoute = {
  middlewares: [SessionManager.authMiddleware, body("onIt").isBoolean(), validationMiddleware],
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

    const idx = task.players.findIndex((t) => t.slug === user.slug);
    const { onIt } = req.body;
    if (onIt && idx === -1) task.players.push(user);
    if (!onIt && idx !== -1) {
      task.players.splice(idx, 1);
    }

    task = await taskRepo.save(task);

    return res.json(task);
  },
};

export default OnItAction;
