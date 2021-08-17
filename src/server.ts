import grapqhQLServer from "./graphql";
import logger from "./helpers/logger";
import config from "config";
import moment from "moment-timezone";
import { walkSyncFiles } from "./helpers/common";
import path from "path";
import startExpressApp from "./express";

function executeSeedings() {
  const seedingFiles = walkSyncFiles(path.join(__dirname)).filter((f) =>
    /(.*).seeding.js$/.test(f)
  );
  seedingFiles.map(async (f) => {
    const { default: seeding } = require(f);
    await seeding();
  });
}

(async function () {
  moment.tz.setDefault(config.get("tz"));
  await executeSeedings();
  const port = config.get<number>("port");
  const app = startExpressApp();
  const server = app.listen(port, "0.0.0.0", () => {
    logger.info(
      `Server is running at http://localhost:${port} in ${config.util.getEnv("NODE_ENV")} mode`
    );
  });
  grapqhQLServer(app, server);
})();
