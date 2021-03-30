import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Routes } from "./config/routes";
import http, { Server } from "http";
import passport from "passport";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public http: Server;

  constructor() {
    (this.app as any) = express();

    this.http = http.createServer(this.app);
    this.config();
    this.routePrv.routes(this.app);
  }

  /**
   * Middlewares configuration
   */
  private config(): void {
    this.app.use(passport.initialize());
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }
}

export default new App();
