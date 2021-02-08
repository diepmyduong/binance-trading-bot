import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IDiligencePointsImportingLog = BaseDocument & {
  email: string;
  point: string;
  note: string;
  success: Boolean;
  error: string;
};

const diligencePointsImportingLogSchema = new Schema(
  {
    email: { type: String },
    point: { type: String },
    note: { type: String },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// diligencePointsImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const DiligencePointsImportingLogHook = new ModelHook<IDiligencePointsImportingLog>(diligencePointsImportingLogSchema);
export const DiligencePointsImportingLogModel: mongoose.Model<IDiligencePointsImportingLog> = MainConnection.model(
  "DiligencePointsImportingLog",
  diligencePointsImportingLogSchema
);

export const DiligencePointsImportingLogLoader = ModelLoader<IDiligencePointsImportingLog>(DiligencePointsImportingLogModel, DiligencePointsImportingLogHook);
