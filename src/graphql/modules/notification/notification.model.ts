import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum NotificationType {
  MESSAGE = "MESSAGE", // Tin nhắn
  ORDER = "ORDER", // Đơn hàng
  PRODUCT = "PRODUCT", // Sản phẩm
  WEBSITE = "WEBSITE", // Website
}
export enum NotificationTarget {
  MEMBER = "MEMBER", // Gửi tới chủ shop
  STAFF = "STAFF", // Gưi tới staff
}
export type INotification = BaseDocument & {
  target?: NotificationTarget; // Gửi tới
  memberId?: string; // Mã chủ shop
  staffId?: string; // Mã nhân viên
  title?: string; // Tiêu đề thông báo
  body?: string; // Nội dung thông báo
  type?: NotificationType; // Loại thông báo
  seen?: boolean; // Đã xem
  seenAt?: Date; // Ngày xem
  image?: string; // Hình ảnh
  sentAt?: Date; // Ngày gửi
  orderId?: string; // Mã đơn hàng
  productId?: string; // Mã sản phẩm
  link?: string; // Link website
};

const notificationSchema = new Schema(
  {
    target: { type: String, enum: Object.values(NotificationTarget), required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
    image: { type: String },
    sentAt: { type: Date },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    link: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

notificationSchema.index({ memberId: 1 });
notificationSchema.index({ staffId: 1 });
notificationSchema.index({ title: "text" }, { weights: { title: 2 } });
notificationSchema.index({ sentAt: 1 });

export const NotificationHook = new ModelHook<INotification>(notificationSchema);
export const NotificationModel: mongoose.Model<INotification> = MainConnection.model(
  "Notification",
  notificationSchema
);

export const NotificationLoader = ModelLoader<INotification>(NotificationModel, NotificationHook);
