import { Request, Response } from "express";
import IRoute from "../../route";

import PersistentConfiguration from "../../../config/persitent";
import Globals from "../../../config/globals";

import passport from "../../../config/passport";

function deny(res: Response) {
  return res.redirect(302, "/#/?error="+encodeURI('External authentication disabled'));
}

const ExternalAction: IRoute = {
  middlewares: [],
  async action(req: Request, res: Response, next) {
  	const externalAuthenticationModuleUsed = req.originalUrl.split('/')[2];
    if(Globals.externalAuthenticationModules.indexOf(externalAuthenticationModuleUsed) === -1
     || !await PersistentConfiguration.get("allow-external-authentication")){
      deny(res);
    } else {
      passport.authenticate(externalAuthenticationModuleUsed)(req, res, next)
    }
  },
};

export default ExternalAction;
