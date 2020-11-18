import { Request, Response } from "express";
import { body } from "express-validator";
import logger from "../../config/logger";
import SessionManager from "../../utils/session";
import CTF from "../../entity/CTF";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";
import makeSlug from "../../utils/slugify";
import RightsManager from "../../utils/rights";
import Rights from "../../config/rights";
import CTFTimeService from "../../services/ctftime";
import { getConnection } from "typeorm";

function validateCtfTimeUrl(url: string): number {
  const match = url.trim().match(/^https\:\/\/ctftime\.org\/event\/(\d+)\/?$/);

  try {
    return parseInt(match[1], 10);
  } catch (e) {
    logger.warn(`Failed to extract id from url '${url}'`);
    logger.fatal(e);
    return -1;
  }
}

/**
 * Imports a CTF time event to the local database.
 * Either specify an event ID or a ctf time event URL (eq: https://ctftime.org/event/1124)
 */
const ImportCtfAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.EDIT_CTF]),
    body("ctfTimeIdentifier").custom((input, meta) => {
      (meta.req as any).ctfTimeIdentifier = null;

      if (typeof input === "string") {
        const id = validateCtfTimeUrl(input);
        if (id === -1) return false;
        (meta.req as any).ctfTimeIdentifier = id;
        return true;
      }

      if (typeof input === "number") {
        (meta.req as any).ctfTimeIdentifier = input;
        return true;
      }

      return false;
    }),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { ctfTimeIdentifier } = req as any;

    if (typeof ctfTimeIdentifier !== "number")
      return res.status(400).json({ errors: [{ msg: "Invalid CTF Time identifier provided" }] });

    const event = await CTFTimeService.getEvent(ctfTimeIdentifier);
    if (event === null)
      return res.status(500).json({
        errors: [
          {
            msg: `Failed to retrieve CTF Time event data from id '${ctfTimeIdentifier}'`,
          },
        ],
      });

    const slug = `${event.id}-${makeSlug(event.title)}`;

    const ctfRepo = getConnection().getRepository(CTF);

    const ctf = ctfRepo.create({
      slug,
      title: event.title,
      description: event.description,
      weight: event.weight,
      start: new Date(event.start),
      finish: new Date(event.finish),
      logoUrl: event.logo,
      ctfTimeUrl: event.ctftime_url,
      guests: [],
      ctfUrl: event.url,
    });

    try {
      return res.json(await ctfRepo.save(ctf));
    } catch (e) {
      return res.status(409).json({
        errors: [
          {
            msg: `A CTF with that name ('${slug}') already exists`,
            code: "ALREADY_EXISTS",
            slug,
          },
        ],
      });
    }
  },
};

export default ImportCtfAction;
