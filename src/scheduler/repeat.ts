// Repeat Hello World

import moment from "moment-timezone";
import LuckyWheelJob from "./jobs/luckyWheel.job";
import CollaboratorJob from "./jobs/collaborator.job";
import MemberCommissionJob from "./jobs/memberCommission.job";
import CustomerCommissionJob from "./jobs/customerCommission.job";

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
  MemberCommissionJob.create({})
    .repeatEvery("2 minutes")
    .unique({ name: MemberCommissionJob.jobName })
    .save();
  CustomerCommissionJob.create({})
    .repeatEvery("2 minutes")
    .unique({ name: CustomerCommissionJob.jobName })
    .save();
}
