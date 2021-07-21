import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gender } from "../member/member.model";
const Schema = mongoose.Schema;

export enum ShopRegistionStatus {
  PENDING = "PENDING", // Chờ duyệt
  APPROVED = "APPROVED", // Đã duyệt
  REJECTED = "REJECTED", // Từ chối
}

export type IShopRegistration = BaseDocument & {
  email?: string; // Email
  phone?: string; // Số điện thoại
  name?: string; // Họ tên
  shopCode?: string; // Mã cửa hàng
  shopName?: string; // Tên cửa hàng
  shopLogo?: string; // Logo cửa hàng
  address?: string; // Địa chỉ
  provinceId?: string; // Mã Tỉnh/thành
  districtId?: string; // Mã Quận/huyện
  wardId?: string; // Mã Phường/xã
  province?: string; // Tỉnh/thành
  district?: string; // Quận/huyện
  ward?: string; // Phường/xã
  birthday?: Date; // Ngày sinh
  gender?: Gender; // Giới tính
  status?: ShopRegistionStatus; // Trạng thái
  approvedAt?: Date; // Ngày duyệt
  rejectedAt?: Date; // Ngày từ chối
  memberId?: string; // Tài khoản chủ shop
};

const shopRegistrationSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    shopCode: { type: String, required: true },
    shopName: { type: String, required: true },
    shopLogo: { type: String },
    address: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    birthday: { type: Date },
    gender: { type: String, enum: Object.values(Gender) },
    status: {
      type: String,
      enum: Object.values(ShopRegistionStatus),
      default: ShopRegistionStatus.PENDING,
    },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  { timestamps: true }
);

shopRegistrationSchema.index(
  { email: "text", shopCode: "text" },
  { weights: { email: 2, shopCode: 2 } }
);

export const ShopRegistrationHook = new ModelHook<IShopRegistration>(shopRegistrationSchema);
export const ShopRegistrationModel: mongoose.Model<IShopRegistration> = MainConnection.model(
  "ShopRegistration",
  shopRegistrationSchema
);

export const ShopRegistrationLoader = ModelLoader<IShopRegistration>(
  ShopRegistrationModel,
  ShopRegistrationHook
);
