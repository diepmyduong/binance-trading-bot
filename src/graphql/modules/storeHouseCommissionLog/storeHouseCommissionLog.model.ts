import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IStoreHouseCommissionLog = BaseDocument & {
  memberId: string; // Mã thành viên
  value?: number; // Giá trị
  orderId: string; // Mã đơn hàng
};

const storeHouseCommissionLogSchema = new Schema(
  {
    value: { type: Number, required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

// storeHouseCommissionLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const StoreHouseCommissionLogHook = new ModelHook<IStoreHouseCommissionLog>(storeHouseCommissionLogSchema);
export const StoreHouseCommissionLogModel: mongoose.Model<IStoreHouseCommissionLog> = MainConnection.model(
  "StoreHouseCommissionLog",
  storeHouseCommissionLogSchema
);

export const StoreHouseCommissionLogLoader = ModelLoader<IStoreHouseCommissionLog>(StoreHouseCommissionLogModel, StoreHouseCommissionLogHook);
