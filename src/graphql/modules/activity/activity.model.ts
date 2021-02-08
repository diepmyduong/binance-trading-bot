import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
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

activitySchema.index(
  { username: "text", message: "text" },
  { weights: { username: 2, message: 4 } }
);

export const ActivityHook = new ModelHook<IActivity>(activitySchema);
export const ActivityModel: mongoose.Model<IActivity> = MainConnection.model(
  "Activity",
  activitySchema
);

export const ActivityLoader = ModelLoader<IActivity>(ActivityModel, ActivityHook);
