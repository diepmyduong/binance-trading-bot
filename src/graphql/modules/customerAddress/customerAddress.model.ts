import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICustomerAddress = BaseDocument & {
  customerId?: string; // Mã khách hàng
  provinceId?: string; // Mã tỉnh/thành
  districtId?: string; // Mã quận/huyện
  wardId?: string; // Mã phường/xã
  province?: string; // Tỉnh/ thành
  district?: string; // Quận/ huyện
  ward?: string; // Phường/ xã
  address?: string; // Địa chỉ
  location?: any; // Toạ độ
  isDefault?: boolean; // Địa chỉ mặc định
};
export const PointSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], required: true },
  coordinates: { type: [Number] },
});

const customerAddressSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    provinceId: { type: String, required: true },
    districtId: { type: String, required: true },
    wardId: { type: String, required: true },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    address: { type: String, required: true },
    location: { type: PointSchema },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);
customerAddressSchema.index({ customerId: 1 });
// customerAddressSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CustomerAddressHook = new ModelHook<ICustomerAddress>(customerAddressSchema);
export const CustomerAddressModel: mongoose.Model<ICustomerAddress> = MainConnection.model(
  "CustomerAddress",
  customerAddressSchema
);

export const CustomerAddressLoader = ModelLoader<ICustomerAddress>(
  CustomerAddressModel,
  CustomerAddressHook
);
