import { Job } from "agenda";
import { groupBy } from "lodash";
import winston from "winston";

import { CounterModel } from "../../graphql/modules/counter/counter.model";
import { counterService } from "../../graphql/modules/counter/counter.service";
import { DeviceInfoModel, IDeviceInfo } from "../../graphql/modules/deviceInfo/deviceInfo.model";
import { NotificationHelper } from "../../graphql/modules/notification/notification.helper";
import {
  INotification,
  NotificationModel,
  NotificationTarget,
} from "../../graphql/modules/notification/notification.model";
import { firebaseHelper } from "../../helpers";
import { errorFormat, simpleTimestampFormat } from "../../loaders/logger";
import { Agenda } from "../agenda";
const logger = winston.createLogger({
  format: simpleTimestampFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/sendNotification.log`,
    }),
  ],
});
const errorLogger = winston.createLogger({
  format: errorFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/sendNotification.error.log`,
    }),
  ],
});
export class SendNotificationJob {
  static jobName = "SendNotification";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    const counter = await CounterModel.findOne({ name: "notify" });
    if (!counter || counter.value <= 0) return done();
    await Promise.all([sendNotificationToMembers(job), sendNotificationToStaff(job)]);
    logger.info("Send Done");
    done();
  }

  static trigger(step?: number) {
    counterService.trigger("notify", 0, step);
  }
}

export default SendNotificationJob;
async function sendNotificationToMembers(job: Job) {
  const match = {
    sentAt: { $exists: false },
    target: NotificationTarget.MEMBER,
  };
  for (let i = 0; i < (await NotificationModel.count(match)); ) {
    const members = await getMemberNotifications();
    const memberDevices = await getMemberDevices(members);
    const task: Promise<any>[] = [];
    let notificationIds: string[] = [];
    try {
      for (const m of members) {
        const devices = memberDevices[m._id];
        notificationIds = [...notificationIds, ...m.notifications.map((n: INotification) => n._id)];
        if (!devices) continue;
        logger.info(`Send Notification To Member ${m._id} with ${devices.length} Devices`);
        sendNotificationToDevices(devices, m.notifications, task);
      }
      if (task.length > 0) {
        await Promise.all(task).catch(errorLogger.error);
      }
    } catch (error) {
      errorLogger.error(error);
    } finally {
      await updateNoficationCounter(notificationIds);
      await job.touch();
    }
  }
}
async function sendNotificationToStaff(job: Job) {
  const match = {
    sentAt: { $exists: false },
    target: NotificationTarget.STAFF,
  };
  for (let i = 0; i < (await NotificationModel.count(match)); ) {
    const staffs = await getStaffNotifications();
    const staffDevices = await getStaffDevices(staffs);
    const task: Promise<any>[] = [];
    let notificationIds: string[] = [];
    try {
      for (const m of staffs) {
        const devices = staffDevices[m._id];
        notificationIds = [...notificationIds, ...m.notifications.map((n: INotification) => n._id)];
        if (!devices) continue;
        logger.info(`Send Notification To Staff ${m._id} with ${devices.length} Devices`);
        sendNotificationToDevices(devices, m.notifications, task);
      }
      if (task.length > 0) {
        await Promise.all(task).catch(errorLogger.error);
      }
    } catch (error) {
      errorLogger.error(error);
    } finally {
      await updateNoficationCounter(notificationIds);
      await job.touch();
    }
  }
}

function sendNotificationToDevices(
  devices: IDeviceInfo[],
  notifications: INotification[],
  task: Promise<any>[]
) {
  if (devices && devices.length > 0) {
    // Gửi tin nhắn tới thiết bị
    for (const n of notifications as INotification[]) {
      const fcmData = new NotificationHelper(n).getFCMData();
      for (const d of devices) {
        task.push(firebaseHelper.messaging.send({ ...fcmData, token: d.deviceToken } as any));
      }
    }
  }
}

async function updateNoficationCounter(notificationIds: string[]) {
  if (notificationIds.length > 0) {
    logger.info(`Sended ${notificationIds.length} Notifications`);
    // Cập nhật tin nhắn đã gửi
    await NotificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { sentAt: new Date() } }
    ).exec();
    await CounterModel.updateOne(
      { name: "notify" },
      { $inc: { value: -notificationIds.length } }
    ).exec();
  } else {
    await CounterModel.updateOne({ name: "notify" }, { $set: { value: 0 } }).exec();
  }
}

function getStaffDevices(staffs: any[]) {
  return DeviceInfoModel.find({
    staffId: { $in: staffs.map((m) => m._id) },
  }).then((res) => groupBy(res, "staffId"));
}

function getMemberDevices(members: any[]) {
  return DeviceInfoModel.find({
    memberId: { $in: members.map((m) => m._id) },
  }).then((res) => groupBy(res, "memberId"));
}

function getStaffNotifications(): any[] | PromiseLike<any[]> {
  return NotificationModel.aggregate([
    { $match: { sentAt: { $exists: false }, target: NotificationTarget.STAFF } },
    { $limit: 1000 },
    {
      $group: {
        _id: "$staffId",
        notifications: { $push: "$$ROOT" },
      },
    },
  ]);
}

function getMemberNotifications(): any[] | PromiseLike<any[]> {
  return NotificationModel.aggregate([
    { $match: { sentAt: { $exists: false }, target: NotificationTarget.MEMBER } },
    { $limit: 1000 },
    {
      $group: {
        _id: "$memberId",
        notifications: { $push: "$$ROOT" },
      },
    },
  ]);
}
