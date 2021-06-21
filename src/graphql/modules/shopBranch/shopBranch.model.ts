import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { LocationSchema } from "../addressStorehouse/types/location.type";
import { OperatingTime, OperatingTimeSchema } from "./operatingTime.graphql";
const Schema = mongoose.Schema;

export type IShopBranch = BaseDocument & {
  memberId?: string; // Mã chủ shop
  code?: string; // Mã chi nhánh
  name?: string; // Tên chi nhánh
  phone?: string; // Số điện thoại
  email?: string; // Email liên hệ
  address?: string; // Địa chỉ
  wardId?: string; // Mã Phường/xã
  districtId?: string; // Mã Quận/huyện
  provinceId?: string; // Mã Tỉnh/thành
  province?: string; // Tỉnh/thành
  district?: string; // Quận/huyện
  ward?: string; // Phường/xã
  activated?: boolean; // hiệu lực hay không hiệu lực
  location?: any; // Toạ độ
  coverImage?: string; // Hình ảnh cover

  operatingTimes?: OperatingTime[]; // Thời gian hoạt động
};

const shopBranchSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    wardId: { type: String, required: true },
    districtId: { type: String, required: true },
    provinceId: { type: String, required: true },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    activated: { type: Boolean, default: false },
    location: { type: LocationSchema, required: true },
    coverImage: { type: String },
    operatingTimes: { type: [OperatingTimeSchema], default: [] },
  },
  { timestamps: true }
);

shopBranchSchema.index({ location: "2dsphere" });
shopBranchSchema.index({ name: "text", code: "text" }, { weights: { name: 2, code: 2 } });

export const ShopBranchHook = new ModelHook<IShopBranch>(shopBranchSchema);
export const ShopBranchModel: mongoose.Model<IShopBranch> = MainConnection.model(
  "ShopBranch",
  shopBranchSchema
);

export const ShopBranchLoader = ModelLoader<IShopBranch>(ShopBranchModel, ShopBranchHook);
