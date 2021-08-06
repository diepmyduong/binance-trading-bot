import path from "path";

import { UtilsHelper } from "../helpers";
import { Agenda } from "./agenda";
import { InitRepeatJobs } from "./repeat";

Agenda.on("ready", () => {
  console.log("Agenda Ready");
  Agenda.start().then(async () => {
    console.log("Agenda started");
    const JobFiles = UtilsHelper.walkSyncFiles(path.join(__dirname));
    JobFiles.filter((f: any) => /(.*).job.js$/.test(f)).map((f: any) => {
      const { default: job } = require(f);
      console.log("Define Job", job.jobName);
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
