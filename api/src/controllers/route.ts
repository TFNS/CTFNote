import { Request, Response } from "express";

export default interface IRoute {
  middlewares: any[]; // 'Any' because express do not export the "middleware" function type
  action: (req: Request, res: Response, next) => void;
}
