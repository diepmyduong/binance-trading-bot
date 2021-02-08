import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IRegisSMSImportingLog = BaseDocument & {
  phone: string;
  code: string;
  note: string;
  success: Boolean;
  error: string;
};

const regisSMSImportingLogSchema = new Schema(
  {
    phone: { type: String },
    code: { type: String },
    note: { type: String },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// regisSMSImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const RegisSMSImportingLogHook = new ModelHook<IRegisSMSImportingLog>(regisSMSImportingLogSchema);
export const RegisSMSImportingLogModel: mongoose.Model<IRegisSMSImportingLog> = MainConnection.model(
  "RegisSMSImportingLog",
  regisSMSImportingLogSchema
);

export const RegisSMSImportingLogLoader = ModelLoader<IRegisSMSImportingLog>(RegisSMSImportingLogModel, RegisSMSImportingLogHook);
