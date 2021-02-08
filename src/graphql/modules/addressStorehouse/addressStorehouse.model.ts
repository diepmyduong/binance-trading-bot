import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressStorehouse = BaseDocument & {
  name?: string; // Tên kho
  phone: string; // Số điện thoại
  email: string; // Email liên hệ
  address?: string; // Địa chỉ kho
  wardId?: string; // Mã Phường/xã
  districtId?: string; // Mã Quận/huyện
  provinceId?: string; // Mã Tỉnh/thành
  province: string; // Tỉnh/thành
  district: string; // Quận/huyện
  ward: string; // Phường/xã
};

//địa điểm kho
const addressStorehouseSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String, required: true },
    wardId: { type: String, required: true },
    districtId: { type: String, required: true },
    provinceId: { type: String, required: true },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
  },
  { timestamps: true }
);

// addressStorehouseSchema.index({ name: "text" }, { weights: { name: 2 } });

export const AddressStorehouseHook = new ModelHook<IAddressStorehouse>(
  addressStorehouseSchema
);
export const AddressStorehouseModel: mongoose.Model<IAddressStorehouse> = MainConnection.model(
  "AddressStorehouse",
  addressStorehouseSchema
);

export const AddressStorehouseLoader = ModelLoader<IAddressStorehouse>(
  AddressStorehouseModel,
  AddressStorehouseHook
);
