import "reflect-metadata";
import app from "./app";
import Globals from "./config/globals";
import { createConnection } from "typeorm";

import logger from "./config/logger";

function debugRoutes() {
  logger.debug("Routes: ");
  const routes = [];
  for (const layer of app.app._router.stack) {
    if (layer.route)
      routes.push({
        methods: Object.keys(layer.route.methods).join(", ").toUpperCase(), path: layer.route.path
      })
  }
  console.table(
    routes
  );
}

function debugGlobals() {
  logger.info("Configuration: ");
  console.table(Globals);
}


async function main() {
  debugRoutes();
  debugGlobals();
  await createConnection()

  await Globals.init();
  app.http.listen(Globals.port, () => logger.success(`App listening on port ${Globals.port}!`));
}

main();





