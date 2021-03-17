import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressDelivery = BaseDocument & {
  code?: string; // Mã địa điểm
  name?: string; // Tên địa điểm
  phone: string; // Số điện thoại
  email: string; // Email liên hệ
  address?: string; // Địa chỉ
  wardId: string; // Mã Phường/xã
  districtId: string; // Mã Quận/huyện
  provinceId: string; // Mã Tỉnh/thành
  province: string; // Tỉnh/thành
  district: string; // Quận/huyện
  ward: string; // Phường/xã
  activated: boolean; // hiệu lực hay không hiệu lực
};

//địa điểm nhận hàng
const addressDeliverySchema = new Schema(
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
    activated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// STT	Tên kho	Số điện thoại	Email	Địa chỉ	Tỉnh/Thành	Quận/Huyện	Phường/Xã

addressDeliverySchema.index(
  { 
    name: "text" ,
    address: "text" ,
    phone: "text" ,
    email: "text" ,
  }, 
  { weights: { 
    name: 2,
    address: 2 ,
    phone: 1 ,
    email: 1 ,
  } }
  );

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