import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IEVoucherImportingLog = BaseDocument & {
  code: string;
  name: string;
  desc: string;
  voucher: string;
  success: Boolean;
  error: string;
};

const eVoucherImportingLogSchema = new Schema(
  {
    code: { type: String },
    name: { type: String },
    desc: { type: String },
    voucher: { type: String },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// eVoucherImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const EVoucherImportingLogHook = new ModelHook<IEVoucherImportingLog>(eVoucherImportingLogSchema);
export const EVoucherImportingLogModel: mongoose.Model<IEVoucherImportingLog> = MainConnection.model(
  "EVoucherImportingLog",
  eVoucherImportingLogSchema
);

export const EVoucherImportingLogLoader = ModelLoader<IEVoucherImportingLog>(EVoucherImportingLogModel, EVoucherImportingLogHook);
