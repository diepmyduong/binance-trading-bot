import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressDeliveryImportingLog = BaseDocument & {
  no: string;
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

const addressDeliveryImportingLogSchema = new Schema(
  {
    no: { type: String },
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

// addressDeliveryImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const AddressDeliveryImportingLogHook = new ModelHook<
  IAddressDeliveryImportingLog
>(addressDeliveryImportingLogSchema);
export const AddressDeliveryImportingLogModel: mongoose.Model<IAddressDeliveryImportingLog> = MainConnection.model(
  "AddressDeliveryImportingLog",
  addressDeliveryImportingLogSchema
);

export const AddressDeliveryImportingLogLoader = ModelLoader<
  IAddressDeliveryImportingLog
>(AddressDeliveryImportingLogModel, AddressDeliveryImportingLogHook);
