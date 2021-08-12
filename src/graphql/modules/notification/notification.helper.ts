import { INotification, NotificationType } from "./notification.model";

export class NotificationHelper {
  constructor(public item: INotification) {}

  getFCMData() {
    const notification = {
      title: this.item.title,
      body: this.item.body,
    };
    const notifyData: any = {
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      type: this.item.type,
      id: this.item._id.toString(),
    };
    switch (this.item.type) {
      case NotificationType.WEBSITE:
        notifyData.link = this.item.link.toString();
        break;
    }
    return {
      notification,
      data: notifyData,
      android: {
        priority: "high",
        notification: { ...notification, sound: "default" },
        data: notifyData,
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };
  }
}
