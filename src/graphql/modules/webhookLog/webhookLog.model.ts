import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IWebhookLog = BaseDocument & {
  name?: string;
  body?: any;
  headers?: any;
  query?: any;
  data?: any;
};

const webhookLogSchema = new Schema(
  {
    name: { type: String },
    body: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    query: { type: Schema.Types.Mixed },
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// webhookLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const WebhookLogHook = new ModelHook<IWebhookLog>(webhookLogSchema);
export const WebhookLogModel: mongoose.Model<IWebhookLog> = MainConnection.model(
  "WebhookLog",
  webhookLogSchema
);

export const WebhookLogLoader = ModelLoader<IWebhookLog>(WebhookLogModel, WebhookLogHook);
