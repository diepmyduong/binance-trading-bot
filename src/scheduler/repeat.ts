// Repeat Hello World

import moment from "moment-timezone";
import LuckyWheelJob from "./jobs/luckyWheel.job";
import CollaboratorJob from "./jobs/collaborator.job";
import CampaignJob from "./jobs/campaign.job";
import MemberCommissionJob from "./jobs/memberCommission.job";
import CustomerCommissionJob from "./jobs/customerCommission.job";
import OrderJob from "./jobs/order.job";
import SyncSocialEngagementJob from "./jobs/syncSocialEngagement.job";
import SendNotificationJob from "./jobs/sendNotification.job";
import RefreshAhamoveTokenJob from "./jobs/refreshAhamoveToken.job";
import CancelPickupStoreOrderJob from "./jobs/cancelPickupStoreOrder.job";
import { configs } from "../configs";
import UpdateCustomerContextJob from "./jobs/updateCustomerContext.job";

export function InitRepeatJobs() {
  console.log("Generate Repeat Jobs");
  LuckyWheelJob.create({}).repeatEvery("5 seconds").unique({ name: LuckyWheelJob.jobName }).save();
  CollaboratorJob.create({})
    .repeatEvery("5 minutes", { skipImmediate: true })
    .unique({ name: CollaboratorJob.jobName })
    .save();
  MemberCommissionJob.create({})
    .repeatEvery("2 minutes", { skipImmediate: true })
    .unique({ name: MemberCommissionJob.jobName })
    .save();
  CustomerCommissionJob.create({})
    .repeatEvery("2 minutes", { skipImmediate: true })
    .unique({ name: CustomerCommissionJob.jobName })
    .save();
  OrderJob.create({})
    .repeatEvery("24 hours", { skipImmediate: true })
    .unique({ name: OrderJob.jobName })
    .save();
  CampaignJob.create({})
    .repeatEvery("2 minutes", { skipImmediate: true })
    .unique({ name: OrderJob.jobName })
    .save();
  SyncSocialEngagementJob.create({})
    .repeatEvery("1 hours", { skipImmediate: true })
    .unique({ name: SyncSocialEngagementJob.name })
    .save();
  // .then((job) => job.run());

  SendNotificationJob.create({})
    .repeatEvery("5 seconds", { skipImmediate: true })
    .unique({ name: SendNotificationJob.jobName })
    .save();

  RefreshAhamoveTokenJob.create({})
    .repeatEvery("1 day", { skipImmediate: true })
    .unique({ name: SendNotificationJob.jobName })
    .save();
  // .then((job) => job.run());

  CancelPickupStoreOrderJob.create({})
    .repeatEvery("0 0 * * *", { skipImmediate: true, timezone: configs.timezone })
    .unique({ name: CancelPickupStoreOrderJob.jobName })
    .save();
  // .then((job) => job.run());

  UpdateCustomerContextJob.create({})
    .repeatEvery("0 * * * *", { skipImmediate: true, timezone: configs.timezone })
    .unique({ name: UpdateCustomerContextJob.jobName })
    .save();
  // .then((job) => job.run());
}
