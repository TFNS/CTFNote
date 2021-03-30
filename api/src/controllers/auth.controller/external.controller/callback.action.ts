import { Request, Response } from "express";
import IRoute from "../../route";

import logger from "../../../config/logger";
import Globals from "../../../config/globals";
import PersistentConfiguration from "../../../config/persitent";

import passport from "../../../config/passport";

function deny(res: Response, msg: string) {
  return res.redirect(302, "/#/?error="+encodeURI(msg));
}

const CallbackAction: IRoute = {
  middlewares: [],
  async action(req: Request, res: Response, next) {
    const externalAuthenticationModuleUsed = req.originalUrl.split('/')[2];
    if(Globals.externalAuthenticationModules.indexOf(externalAuthenticationModuleUsed) === -1
      || !await PersistentConfiguration.get("allow-external-authentication")){
      deny(res,`External authentication disabled`);
    } else {
      passport.authenticate(externalAuthenticationModuleUsed,  function(err, user, info) {
        logger.debug(err, user, info);
        if(err){
          deny(res,err);
        } else if(user) {
          res.cookie(user.cookieName, user.cookie, user.cookieOptions);
          return res.redirect("/#/");
        }
      })(req, res, next);
    }
  },
};

export default CallbackAction;
