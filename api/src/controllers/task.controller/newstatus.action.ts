import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import RightsManager from "../../utils/rights";
import validationMiddleware from "../../utils/validation";
import { body } from "express-validator";
import Task from "../../entity/Task";
import CTF from "../../entity/CTF";
import Status from "../../entity/Status";
import { getConnection } from "typeorm";

const NewStatusAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    body("status").exists().isString(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { ctfSlug, taskSlug } = req.params;
    const user = SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);
    const taskRepo = getConnection().getRepository(Task);
    const statusRepo = getConnection().getRepository(Status);
    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "tasks.statuses", "task.players", "guests"] });
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

    const status = {
      value: req.body.status,
      user,
      task
    };

    const { identifiers: [{ id }] } = await getConnection().createQueryBuilder().insert().into(Status).values([status]).execute();

    task.statuses.push(await statusRepo.findOne({ id }));

    task = await taskRepo.save(task);

    return res.json(task);
  },
};

export default NewStatusAction;
