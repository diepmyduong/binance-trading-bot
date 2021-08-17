import mongoose from "mongoose";
import { MainConnection } from "../../../helpers/mongo";
import { BaseDocument, ModelLoader } from "../../../base/model";
const Schema = mongoose.Schema;
export enum NotificationType {
  MESSAGE = "MESSAGE", // Tin nhắn
  WEBSITE = "WEBSITE", // Website
}
export enum NotificationTarget {}
export type INotification = BaseDocument & {
  target?: NotificationTarget; // Gửi tới
  memberId?: string; // Mã chủ shop
  staffId?: string; // Mã nhân viên
  customerId?: string; // Mã khách hàng
  title?: string; // Tiêu đề thông báo
  body?: string; // Nội dung thông báo
  type?: NotificationType; // Loại thông báo
  seen?: boolean; // Đã xem
  seenAt?: Date; // Ngày xem
  image?: string; // Hình ảnh
  sentAt?: Date; // Ngày gửi
  link?: string; // Link website
};

const notificationSchema = new Schema(
  {
    target: { type: String, enum: Object.values(NotificationTarget), required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
    image: { type: String },
    sentAt: { type: Date },
    link: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

notificationSchema.index({ memberId: 1 });
notificationSchema.index({ staffId: 1 });
notificationSchema.index({ title: "text" }, { weights: { title: 2 } } as any);
notificationSchema.index({ sentAt: 1 });

export const NotificationStackModel = MainConnection.model("NotificationStack", notificationSchema);

export const NotificationModel = MainConnection.model<INotification>(
  "Notification",
  notificationSchema
);

export const NotificationLoader = ModelLoader<INotification>(NotificationModel);
