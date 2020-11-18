import { Request, Response } from "express";
import { body } from "express-validator";
import { getConnection } from "typeorm";
import logger from "../../config/logger";
import Rights from "../../config/rights";
import CTF from "../../entity/CTF";
import User from "../../entity/User";
import RightsManager from "../../utils/rights";
import SessionManager from "../../utils/session";
import validationMiddleware from "../../utils/validation";
import IRoute from "../route";

const InviteUserAction: IRoute = {
  middlewares: [
    SessionManager.authMiddleware,
    RightsManager.grantMiddleware([Rights.EDIT_CTF]),
    body("userSlug").isString(),
    body("invite").isBoolean(),
    validationMiddleware,
  ],
  async action(req: Request, res: Response, next) {
    const { slug } = req.params;

    const user = SessionManager.getUser(req);

    const ctfRepo = getConnection().getRepository(CTF);
    const userRepo = getConnection().getRepository(User);
    let ctf = await ctfRepo.findOne({ slug }, { relations: ["tasks", "guests"] });

    if (!ctf) return res.status(400).json({ errors: [{ message: `Invalid CTF slug` }] });

    const grantedCtf = await RightsManager.isGrantedCTF(user, ctf);
    if (!grantedCtf) return res.status(403).json({ errors: [{ message: `You are not playing this CTF` }] });

    // Retrieve the concerned user
    const guest = await userRepo.findOne({ slug: req.body.userSlug });
    if (!guest) return res.status(400).json({ errors: [{ message: `The requested user does not exist` }] });

    const idx = ctf.guests.findIndex((g) => g.slug === guest.slug);
    const { invite } = req.body;
    if (invite && idx === -1) ctf.guests.push(guest);
    if (!invite && idx !== -1) {
      ctf.guests.splice(idx, 1);
    }

    try {
      ctf = await ctfRepo.save(ctf);
    } catch (e) {
      logger.warn(`Could not update the CTF: `);
      logger.fatal(e);
      return res.status(500).json({
        errors: [{ message: `Could not update the CTF, contact administrator` }],
      });
    }

    return res.json(ctf);
  },
};

export default InviteUserAction;
