import { walkSyncFiles } from "../helpers/common";
import { Agenda } from "./agenda";
import path from "path";
import config from "config";
import logger from "../helpers/logger";
import InitRepeatJobs from "./repeat";

export default function execute() {
  logger.info("Seeding Job...");
  const definedJobs = config.get<string>("job.defines").split(",");
  const skipedJobs = config.get<string>("job.skips").split(",");
  Agenda.on("ready", () => {
    logger.info("Agenda Ready");
    Agenda.start().then(async () => {
      logger.info("Agenda started");
      if (definedJobs[0] == "NONE") return;
      const JobFiles = walkSyncFiles(path.join(__dirname));
      JobFiles.filter((f: any) => /(.*).job.js$/.test(f)).map((f: any) => {
        const { default: job } = require(f);
        if (definedJobs.length > 0 && !definedJobs.includes(job.jobName)) {
          logger.info("Skip Job " + job.jobName);
          return;
        }
        if (skipedJobs.length > 0 && skipedJobs.includes(job.jobName)) {
          logger.info("Exclude Job " + job.jobName);
          return;
        }
        logger.info("Define Job " + job.jobName);
        Agenda.define(job.jobName, { lockLifetime: job.lockLifetime || 10000 }, job.execute);
      });
      InitRepeatJobs();
    });
  });

  async function graceful() {
    await Agenda.stop();
    process.exit(0);
  }

  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);
}
