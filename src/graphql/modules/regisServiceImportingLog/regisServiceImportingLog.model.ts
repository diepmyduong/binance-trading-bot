import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IRegisServiceImportingLog = BaseDocument & {
  phone: string;
  code: string;
  note: string;
  success: Boolean;
  error: string;
};

const regisServiceImportingLogSchema = new Schema(
  {
    phone: { type: String },
    code: { type: String },
    note: { type: String },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// regisServiceImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const RegisServiceImportingLogHook = new ModelHook<IRegisServiceImportingLog>(regisServiceImportingLogSchema);
export const RegisServiceImportingLogModel: mongoose.Model<IRegisServiceImportingLog> = MainConnection.model(
  "RegisServiceImportingLog",
  regisServiceImportingLogSchema
);

export const RegisServiceImportingLogLoader = ModelLoader<IRegisServiceImportingLog>(RegisServiceImportingLogModel, RegisServiceImportingLogHook);
