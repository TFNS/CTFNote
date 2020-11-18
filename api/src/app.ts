import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Routes } from "./config/routes";
import http, { Server } from "http";
import SocketIO from "socket.io";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public http: Server;
  public io: any;

  constructor() {
    (this.app as any) = express();

    this.http = http.createServer(this.app);
    this.config();
    this.routePrv.routes(this.app);
    this.io = SocketIO(this.http);
  }

  /**
   * Middlewares configuration
   */
  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }
}

export default new App();
