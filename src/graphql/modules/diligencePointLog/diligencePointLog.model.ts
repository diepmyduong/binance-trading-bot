import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum DiligencePointLogType {
  RECEIVE_FROM_USER = "RECEIVE_FROM_USER",
  RECEIVE_FROM_IMPORT = "RECEIVE_FROM_IMPORT",
}
export type IDiligencePointLog = BaseDocument & {
  memberId?: string; // Mã thành viên
  value?: number; // Giá trị
  note?: string; // Note
  type?: DiligencePointLogType; // Loại sự kiện
};

const diligencePointLogSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    value: { type: Number, required: true },
    type: { type: String, required: true },
    note: { type: String, required: true },
  },
  { timestamps: true }
);

// diligencePointLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const DiligencePointLogHook = new ModelHook<IDiligencePointLog>(diligencePointLogSchema);
export const DiligencePointLogModel: mongoose.Model<IDiligencePointLog> = MainConnection.model(
  "DiligencePointLog",
  diligencePointLogSchema
);

export const DiligencePointLogLoader = ModelLoader<IDiligencePointLog>(DiligencePointLogModel, DiligencePointLogHook);
