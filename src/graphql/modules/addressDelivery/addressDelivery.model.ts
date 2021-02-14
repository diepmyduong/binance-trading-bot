import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressDelivery = BaseDocument & {
  name?: string; // Tên địa điểm
  phone: string; // Số điện thoại
  email: string; // Email liên hệ
  address?: string; // Địa chỉ
  wardId?: string; // Mã Phường/xã
  districtId?: string; // Mã Quận/huyện
  provinceId?: string; // Mã Tỉnh/thành
  province: string; // Tỉnh/thành
  district: string; // Quận/huyện
  ward: string; // Phường/xã
};

//địa điểm nhận hàng
const addressDeliverySchema = new Schema(
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

// STT	Tên kho	Số điện thoại	Email	Địa chỉ	Tỉnh/Thành	Quận/Huyện	Phường/Xã

// addressDeliverySchema.index({ name: "text" }, { weights: { name: 2 } });

export const AddressDeliveryHook = new ModelHook<IAddressDelivery>(
  addressDeliverySchema
);
export const AddressDeliveryModel: mongoose.Model<IAddressDelivery> = MainConnection.model(
  "AddressDelivery",
  addressDeliverySchema
);

export const AddressDeliveryLoader = ModelLoader<IAddressDelivery>(
  AddressDeliveryModel,
  AddressDeliveryHook
);