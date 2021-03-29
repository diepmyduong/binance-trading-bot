import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IStoreHouseCommissionLog = BaseDocument & {
};

const storeHouseCommissionLogSchema = new Schema(
  {
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
