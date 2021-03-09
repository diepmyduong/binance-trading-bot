// Repeat Hello World

import moment from "moment-timezone";
import LuckyWheelJob from "./jobs/luckyWheel.job";
import CollaboratorJob from "./jobs/collaborator.job";

export function InitRepeatJobs() {
  console.log("Generate Repeat Jobs");
  LuckyWheelJob.create({})
    .repeatEvery("5 seconds")
    .unique({ name: LuckyWheelJob.jobName })
    .save();
  CollaboratorJob.create({})
    .repeatEvery("5 minutes")
    .unique({ name: CollaboratorJob.jobName })
    .save();
}
