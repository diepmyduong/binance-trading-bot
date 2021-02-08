import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type INotification = BaseDocument & {
  userId?: string;
  memberId?: string;
  title?: string;
  body?: string;
  clickAction?: string;
  data?: any;
  seen?: boolean;
  seenAt?: Date;
  hash?: string;
  image?: string;
};

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    memberId: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    body: { type: String },
    clickAction: { type: String },
    data: { type: Schema.Types.Mixed },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
    hash: { type: String },
    image: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

notificationSchema.index({ userId: 1 });
notificationSchema.index({ memberId: 1 });
notificationSchema.index({ title: "text" }, { weights: { title: 7 } });

export const NotificationHook = new ModelHook<INotification>(notificationSchema);
export const NotificationModel: mongoose.Model<INotification> = MainConnection.model(
  "Notification",
  notificationSchema
);

export const NotificationLoader = ModelLoader<INotification>(NotificationModel, NotificationHook);
