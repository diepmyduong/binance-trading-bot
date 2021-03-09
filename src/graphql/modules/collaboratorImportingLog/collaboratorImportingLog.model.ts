import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICollaboratorImportingLog = BaseDocument & {
  no: string;
  code: string;
  name: string;
  phone: string;
  line: Number;
  success: Boolean;
  error: string;
};

const collaboratorImportingLogSchema = new Schema(
  {
    no: { type: String },
    code: {type: String},
    name: { type: String },
    phone: { type: String },
    line: { type: Number },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// collaboratorImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CollaboratorImportingLogHook = new ModelHook<ICollaboratorImportingLog>(collaboratorImportingLogSchema);
export const CollaboratorImportingLogModel: mongoose.Model<ICollaboratorImportingLog> = MainConnection.model(
  "CollaboratorImportingLog",
  collaboratorImportingLogSchema
);

export const CollaboratorImportingLogLoader = ModelLoader<ICollaboratorImportingLog>(CollaboratorImportingLogModel, CollaboratorImportingLogHook);
