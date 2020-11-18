import { Request, Response } from "express";
import { body } from "express-validator";
import SessionManager from "../../utils/session";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";
import CTF from "../../entity/CTF";
import makeSlug from "../../utils/slugify";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import { getConnection } from "typeorm";

/**
 * Imports a CTF time event to the local database.
 * Either specify an event ID or a ctf time event URL (eq: https://ctftime.org/event/1124)
 */
const CreateCtfAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.EDIT_CTF]),
    body("title").isString(),
    body("weight").optional().isNumeric(),
    body("ctfUrl").optional().isString(),
    body("logoUrl").optional().isString(),
    body("ctfTimeUrl").optional().isString(),
    body("format").optional().isString(),
    body("description").optional().isString(),
    body("start").optional().isString(),
    body("finish").optional().isString(),
    body("credentials").optional().isString(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const ctfRepo = getConnection().getRepository(CTF);
    const slug = makeSlug(req.body.title);

    let ctf = new CTF();
    ctf.slug = slug;
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
      return res.status(409).json({ errors: [{ msg: "A CTF with that title already exists" }] });
    }
    return res.json(ctf);
  },
};

export default CreateCtfAction;
