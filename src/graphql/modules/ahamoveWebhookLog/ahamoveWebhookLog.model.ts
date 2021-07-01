import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAhamoveWebhookLog = BaseDocument & {
  order?: any;
};

const ahamoveWebhookLogSchema = new Schema(
  {
    order: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// ahamoveWebhookLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const AhamoveWebhookLogHook = new ModelHook<IAhamoveWebhookLog>(ahamoveWebhookLogSchema);
export const AhamoveWebhookLogModel: mongoose.Model<IAhamoveWebhookLog> = MainConnection.model(
  "AhamoveWebhookLog",
  ahamoveWebhookLogSchema
);

export const AhamoveWebhookLogLoader = ModelLoader<IAhamoveWebhookLog>(
  AhamoveWebhookLogModel,
  AhamoveWebhookLogHook
);
