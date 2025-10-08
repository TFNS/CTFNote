import { Request, Response, Router } from "express";

export const oauth2Router = Router();

oauth2Router.get("/callback", (req: Request, res: Response) => {
  res.redirect(
    `/#/auth/oauth2/callback/${encodeURIComponent(req.originalUrl)}`
  );
});
