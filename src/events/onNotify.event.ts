import { Subject } from "rxjs";

import { firebaseHelper } from "../helpers/firebase.helper";
import {
  INotification,
  NotificationModel,
} from "../graphql/modules/notification/notification.model";
import { IDeviceInfo, DeviceInfoModel } from "../graphql/modules/deviceInfo/deviceInfo.model";

async function sendToDevices(userDevices: IDeviceInfo[], notifyDoc: INotification) {
  for (const device of userDevices) {
    sendNotification(device, notifyDoc.title, notifyDoc.body, notifyDoc.data);
  }
}

async function sendNotification(
  device: IDeviceInfo,
  messageTitle: string,
  messageBody: string,
  data: any = {}
) {
  // Send a message to the device corresponding to the provided
  // registration token.
  const notification = {
    title: messageTitle,
    body: messageBody,
  };
  const notifyData = {
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    status: "done",
    ...data,
  };
  firebaseHelper.messaging
    .send({
      notification,
      data: notifyData,
      token: device.deviceToken,
      android: {
        priority: "high",
        notification: notification,
        data: notifyData,
      },
    })
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}
export const OnSendNotify = new Subject<{
  userId: string;
  title: string;
  body: string;
  isUser: boolean;
  data?: any;
  image?: string;
}>();

OnSendNotify.subscribe(async (data) => {
  let notify: any = {
    title: data.title,
    body: data.body,
    clickAction: "FLUTTER_NOTIFICATION_CLICK",
    data: data.data,
    image: data.image,
  };
  data.isUser ? (notify.userId = data.userId) : (notify.staffId = data.userId);
  const notification = await NotificationModel.create({ ...notify });
  const userDevices = data.isUser ? await DeviceInfoModel.find({ userId: data.userId }) : await DeviceInfoModel.find({ staffId: data.userId });
  sendToDevices(userDevices, notification);
});
