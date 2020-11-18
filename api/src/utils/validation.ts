import { Request, Response } from "express";
import { Middleware } from "express-validator/src/base";

import { validationResult } from "express-validator";

/**
 * Validate the request against express-validator constraints
 *
 * @param req express Request
 * @param res  express Response
 * @param next  next middleware function
 */
export default function validationMiddleware(
  req: Request,
  res: Response,
  next
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}
