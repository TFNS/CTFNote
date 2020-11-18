import { Request, Response } from "express";
import SessionManager from "../../utils/session";
import IRoute from "../route";
import CTF from "../../entity/CTF";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import validationMiddleware from "../../utils/validation";
import { body } from "express-validator";
import logger from "../../config/logger";
import { getConnection } from "typeorm";

const UpdateCtfAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.EDIT_CTF]),
    body("title").optional({ nullable: true }).isString(),
    body("weight").optional({ nullable: true }).isNumeric(),
    body("ctfUrl").optional({ nullable: true }).isString(),
    body("logoUrl").optional({ nullable: true }).isString(),
    body("ctfTimeUrl").optional({ nullable: true }).isString(),
    body("format").optional({ nullable: true }).isString(),
    body("description").optional({ nullable: true }).isString(),
    body("start").optional({ nullable: true }).isString(),
    body("finish").optional({ nullable: true }).isString(),
    body("credentials").optional({ nullable: true }).isString(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { slug: ctfSlug } = req.params;
    const ctfRepo = getConnection().getRepository(CTF);

    let ctf = await ctfRepo.findOne({ slug: ctfSlug });
    if (!ctf) return res.status(404).json({ errors: [{ msg: "Invalid CTF slug" }] });

    const editableFields = [
      "title",
      "weight",
      "ctfUrl",
      "logoUrl",
      "ctfTimeUrl",
      "format",
      "description",
      "start",
      "finish",
      "credentials",
    ];
    for (const field of editableFields) {
      if (field in req.body) {
        if (field === "start" || field === "end") {
          ctf[field] = new Date(req.body[field]);
        } else {
          ctf[field] = req.body[field];
        }
      }
    }

    try {
      ctf = await ctfRepo.save(ctf);
    } catch (e) {
      logger.warn(`Could not update ctf '${ctfSlug}': `);
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ msg: `Could not update the ctf, contact administrator` }],
      });
    }

    return res.json(ctf);
  },
};

export default UpdateCtfAction;
