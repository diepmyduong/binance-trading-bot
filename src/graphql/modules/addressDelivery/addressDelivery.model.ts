import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IAddressDelivery = BaseDocument & {
  name?: string;
};

//địa điểm nhận hàng
const addressDeliverySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    wardId: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    provinceId: { type: String },
    districtId: { type: String },
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
