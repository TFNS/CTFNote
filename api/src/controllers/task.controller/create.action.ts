import { Request, Response } from "express";
import { body } from "express-validator";
import SessionManager from "../../utils/session";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";
import CTF from "../../entity/CTF";
import Task from "../../entity/Task";
import RightsManager from "../../utils/rights";
import makeSlug from "../../utils/slugify";
import PadService from "../../services/pad";
import { getConnection } from "typeorm";

const CreateTaskAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    body("tasks").isArray(),
    body("tasks.*.title").isString(),
    body("tasks.*.description").optional().isString(),
    body("tasks.*.category").optional().isString(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { slug: ctfSlug } = req.params;
    const { tasks } = req.body;

    const ctfRepo = getConnection().getRepository(CTF);
    const taskRepo = getConnection().getRepository(Task);
    const user = SessionManager.getUser(req);

    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "guests"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const hasRightToCreate = RightsManager.isGrantedCTF(user, ctf);
    if (!hasRightToCreate)
      return res.status(403).json({
        errors: [{ msg: `You don't have the right to create task on this CTF` }],
      });

    for (const task of tasks) {
      const taskSlug = makeSlug(task.title);

      if (ctf.tasks.find((t) => t.slug === taskSlug)) continue;

      const padUrl = await PadService.create();
      const newTask = taskRepo.create({
        title: task.title,
        description: task.description,
        category: task.category,
        padUrl,
        slug: taskSlug,
        ctf,
      });

      await taskRepo.save(newTask);

      ctf.tasks.push(newTask);
    }

    await ctfRepo.save(ctf);

    return res.json({ tasks: ctf.tasks });
  },
};

export default CreateTaskAction;
