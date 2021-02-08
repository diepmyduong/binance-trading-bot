import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum RegisServiceStatus {
  PENDING = "PENDING", // Chờ xử lý
  COMPLETED = "COMPLETED", // Đã duyệt
  CANCELED = "CANCELED", // Đã huỷ
}
export type IRegisService = BaseDocument & {
  code?: string; // Mã đăng ký
  sellerId: string; // Chủ shop
  productId?: string; // Sản phẩm
  productName?: string; // Tên sản phẩm
  basePrice?: number; // Giá sản phẩm
  registerId?: string; // Khách hàng
  registerName?: string; // Tên khách hàng
  registerPhone?: string; // Điện thoại đăng ký
  address?: string; // Địa chỉ
  province?: string; // Tỉnh / thành
  district?: string; // Quận / huyện
  ward?: string; // Phường / xã
  provinceId?: string; // Mã Tỉnh / thành
  districtId?: string; // Mã Quận / huyện
  wardId?: string; // Mã Phường / xã
  status?: RegisServiceStatus; // Trạng thái
  commission0?: number; // Hoa hồng Mobifone
  commission1?: number; // Hoa hồng điểm bán
  commission2?: number; // Hoa hồng giới thiệu
  sellerBonusPoint?: number; // Điểm thường người bán
  buyerBonusPoint?: number; // Điểm thưởng người mua
  campaignId: string; // mã chiến dịch
  campaignSocialResultId: string // mã kết quả chiến dịch
};

const regisServiceSchema = new Schema(
  {
    code: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Member" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    productName: { type: String, required: true },
    basePrice: { type: Number, default: 0, min: 0 },
    registerId: { type: Schema.Types.ObjectId, required: true, ref: "Customer" },
    registerName: { type: String, required: true },
    registerPhone: { type: String, required: true },
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String },
    provinceId: { type: String, required: true },
    districtId: { type: String, required: true },
    wardId: { type: String },
    status: {
      type: String,
      enum: Object.values(RegisServiceStatus),
      default: RegisServiceStatus.PENDING,
    },
    commission0: { type: Number, default: 0, min: 0 },
    commission1: { type: Number, default: 0, min: 0 },
    commission2: { type: Number, default: 0, min: 0 },
    sellerBonusPoint: { type: Number, default: 0, min: 0 },
    buyerBonusPoint: { type: Number, default: 0, min: 0 },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
    campaignSocialResultId: { type: Schema.Types.ObjectId, ref: "CampaignSocialResult" },
  },
  { timestamps: true }
);

regisServiceSchema.index(
  { code: "text", productName: "text", registerPhone: "text" },
  { weights: { code: 2, productName: 2, registerPhone: 2 } }
);
regisServiceSchema.index({ registerPhone: 1 });
regisServiceSchema.index({ sellerId: 1 });
regisServiceSchema.index({ registerId: 1 });

export const RegisServiceHook = new ModelHook<IRegisService>(regisServiceSchema);
export const RegisServiceModel: mongoose.Model<IRegisService> = MainConnection.model(
  "RegisService",
  regisServiceSchema
);

export const RegisServiceLoader = ModelLoader<IRegisService>(RegisServiceModel, RegisServiceHook);
