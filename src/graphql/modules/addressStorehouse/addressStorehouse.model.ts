import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { LocationSchema } from "./types/location.type";
const Schema = mongoose.Schema;

export type IAddressStorehouse = BaseDocument & {
  code?: string;
  name?: string; // Tên kho
  phone: string; // Số điện thoại
  email: string; // Email liên hệ
  address?: string; // Địa chỉ kho
  wardId: string; // Mã Phường/xã
  districtId: string; // Mã Quận/huyện
  provinceId: string; // Mã Tỉnh/thành
  province: string; // Tỉnh/thành
  district: string; // Quận/huyện
  ward: string; // Phường/xã
  activated: boolean; // hiệu lực hay không hiệu lực
  isPost: boolean;
  location: any;
  allowPickup: boolean; //cho phép thu gom
};

//địa điểm kho
const addressStorehouseSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String, required: true },
    wardId: { type: String },
    districtId: { type: String },
    provinceId: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    allowPickup: {type: Boolean},
    activated: { type: Boolean, default: true },
    isPost: { type: Boolean, default: false },
    location: { type: LocationSchema ,default: null }
  },
  { timestamps: true }
);

addressStorehouseSchema.index(
  {
    name: "text",
    address: "text",
    phone: "text",
    email: "text",
  },
  {
    weights: {
      name: 2,
      address: 2,
      phone: 1,
      email: 1,
    },
  }
);

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
