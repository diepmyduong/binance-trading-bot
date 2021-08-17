import mongoose from "mongoose";
import { MainConnection } from "../../../helpers/mongo";
import { BaseDocument, ModelLoader } from "../../../base/model";
const Schema = mongoose.Schema;

export type IActivity = BaseDocument & {
  username?: string;
  message?: string;
};

const activitySchema = new Schema(
  {
    username: { type: String },
    message: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

activitySchema.index({ username: "text", message: "text" }, {
  weights: { username: 2, message: 4 },
} as any);

export const ActivityModel = MainConnection.model<IActivity>("Activity", activitySchema);

export const ActivityLoader = ModelLoader<IActivity>(ActivityModel);
