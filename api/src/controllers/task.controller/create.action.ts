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

    const taskRepo = getConnection().getRepository(Task);
    const ctfRepo = getConnection().getRepository(CTF);
    const user = SessionManager.getUser(req);

    const ctf = await ctfRepo.findOne({ slug: ctfSlug }, { relations: ["tasks", "guests"] });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const hasRightToCreate = RightsManager.isGrantedCTF(user, ctf);
    if (!hasRightToCreate)
      return res.status(403).json({
        errors: [{ msg: `You don't have the right to create task on this CTF` }],
      });

    const newTasks = [];

    for (const t of tasks) {
      const slug = makeSlug(t.title);

      if (ctf.tasks.find(t => t.slug === slug)) continue; // Do not create the task if it already exists within the CTF

      newTasks.push({
        title: t.title,
        description: t.description,
        category: t.category,
        padUrl: await PadService.create(),
        slug,
      });
    }

    const { identifiers } = await getConnection().createQueryBuilder().insert().into(Task).values(newTasks).execute();
    const ids = identifiers.map((i) => i.id);
    for (const id of ids) {
      ctf.tasks.push(await taskRepo.findOne({ id }));
    }

    await ctfRepo.save(ctf);

    return res.json({ tasks: ctf.tasks });
  },
};

export default CreateTaskAction;
