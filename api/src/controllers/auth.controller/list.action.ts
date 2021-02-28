import { Request, Response } from "express";
import IRoute from "../route";

import PersistentConfiguration from "../../config/persitent";
import Globals from "../../config/globals";

const ListExternalAuthenticationModulesAction: IRoute = {
  middlewares: [],
  async action(req: Request, res: Response, next) {
    var externalAuthenticationModules = [];
    
    if(await PersistentConfiguration.get("allow-external-authentication")){
      externalAuthenticationModules = Globals.externalAuthenticationModules;
    }
  	
    return res.json(externalAuthenticationModules);
  },
};

export default ListExternalAuthenticationModulesAction;
