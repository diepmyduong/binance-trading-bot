// Repeat Hello World

import moment from "moment-timezone";
import LuckyWheelJob from "./jobs/luckyWheel.job";

export function InitRepeatJobs() {
  console.log("Generate Repeat Jobs");
  LuckyWheelJob.create({})
    .repeatEvery("5 seconds")
    .unique({ name: LuckyWheelJob.jobName })
    .save();
}
