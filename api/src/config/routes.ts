import { Response } from "express";

import Globals from "./globals";

import AuthAction from "../controllers/auth.controller/login.action";
import RegisterAction from "../controllers/auth.controller/register.action";
import ListExternalAuthenticationModulesAction from "../controllers/auth.controller/list.action";
import ExternalAction from "../controllers/auth.controller/external.controller/external.action";
import CallbackAction from "../controllers/auth.controller/external.controller/callback.action";
import IndexAction from "../controllers/index.controller/index.action";
import ListUserAction from "../controllers/user.controller/list.action";
import MeAction from "../controllers/user.controller/me.action";
import ListCTFAction from "../controllers/ctf.controller/list.action";
import ImportCtfAction from "../controllers/ctf.controller/import.action";
import UpdateUserAction from "../controllers/user.controller/update.action";
import RemoveUserAction from "../controllers/user.controller/remove.action";
import GetCTFAction from "../controllers/ctf.controller/get.action";
import InviteUserAction from "../controllers/ctf.controller/invite.action";
import CreateTaskAction from "../controllers/task.controller/create.action";
import UpdateTaskAction from "../controllers/task.controller/update.action";
import OnItAction from "../controllers/task.controller/onit.action";
import RemoveTaskAction from "../controllers/task.controller/remove.action";
import UpdateCTFAction from "../controllers/ctf.controller/update.action";
import CreateCtfAction from "../controllers/ctf.controller/create.action";

import GetConfigAction from "../controllers/config.controller/get.action";
import UpdateConfigAction from "../controllers/config.controller/update.action";
import LogoutAction from "../controllers/auth.controller/logout.action";
import RemoveCTFAction from "../controllers/ctf.controller/remove.action";

export class Routes {
  public routes(app): void {
    app.get("/", [...IndexAction.middlewares], IndexAction.action);
    app.post("/auth/login", [...AuthAction.middlewares], AuthAction.action);
    app.post("/auth/register", [...RegisterAction.middlewares], RegisterAction.action);
    app.post("/auth/logout", [...LogoutAction.middlewares], LogoutAction.action);

    app.get("/auth/list",[...ListExternalAuthenticationModulesAction.middlewares],ListExternalAuthenticationModulesAction.action)
    Globals.externalAuthenticationModules.forEach(val => {
        app.get(`/auth/${val}`, [...ExternalAction.middlewares], ExternalAction.action);
        app.get(`/auth/${val}/callback`, [...CallbackAction.middlewares], CallbackAction.action);
    })

    app.get("/users", [...ListUserAction.middlewares], ListUserAction.action);
    app.get("/me", [...MeAction.middlewares], MeAction.action);
    app.post("/ctf-import", [...ImportCtfAction.middlewares], ImportCtfAction.action);

    app.put("/users/:slug", [...UpdateUserAction.middlewares], UpdateUserAction.action);
    app.delete("/users/:slug", [...RemoveUserAction.middlewares], RemoveUserAction.action);

    app.post("/ctf", [...CreateCtfAction.middlewares], CreateCtfAction.action);
    app.get("/ctfs", [...ListCTFAction.middlewares], ListCTFAction.action);
    app.get("/ctf/:slug", [...GetCTFAction.middlewares], GetCTFAction.action);
    app.delete("/ctf/:slug", [...RemoveCTFAction.middlewares], RemoveCTFAction.action);
    app.put("/ctf/:slug", [...UpdateCTFAction.middlewares], UpdateCTFAction.action);
    app.put("/ctf/:slug/invite", [...InviteUserAction.middlewares], InviteUserAction.action);
    app.post("/ctf/:slug/task", [...CreateTaskAction.middlewares], CreateTaskAction.action);
    app.put("/ctf/:ctfSlug/tasks/:taskSlug", [...UpdateTaskAction.middlewares], UpdateTaskAction.action);
    app.put("/ctf/:ctfSlug/tasks/:taskSlug/onit", [...OnItAction.middlewares], OnItAction.action);
    app.delete("/ctf/:ctfSlug/tasks/:taskSlug", [...RemoveTaskAction.middlewares], RemoveTaskAction.action);

    app.get("/admin/config", [...GetConfigAction.middlewares], GetConfigAction.action);
    app.put("/admin/config", [...UpdateConfigAction.middlewares, UpdateConfigAction.action]);

    // 404 Handling
    app.use((_: any, res: Response) => {
      return res.status(404).json({ errors: [{ msg: "Resource not found" }] });
    });
  }
}
