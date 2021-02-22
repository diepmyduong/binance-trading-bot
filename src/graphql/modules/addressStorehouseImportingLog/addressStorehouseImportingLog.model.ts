import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressStorehouseImportingLog = BaseDocument & {
  no: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  line: Number;
  success: Boolean;
  error: string;
};

const addressStorehouseImportingLogSchema = new Schema(
  {
    no: { type: String },
    code: {type: String},
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    line: { type: Number },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// addressStorehouseImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const AddressStorehouseImportingLogHook = new ModelHook<
  IAddressStorehouseImportingLog
>(addressStorehouseImportingLogSchema);
export const AddressStorehouseImportingLogModel: mongoose.Model<IAddressStorehouseImportingLog> = MainConnection.model(
  "AddressStorehouseImportingLog",
  addressStorehouseImportingLogSchema
);

export const AddressStorehouseImportingLogLoader = ModelLoader<
  IAddressStorehouseImportingLog
>(AddressStorehouseImportingLogModel, AddressStorehouseImportingLogHook);
