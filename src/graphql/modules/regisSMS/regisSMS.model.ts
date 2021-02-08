import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum RegisSMSStatus {
  PENDING = "PENDING", // Chờ xử lý
  COMPLETED = "COMPLETED", // Đã duyệt
  CANCELED = "CANCELED", // Đã huỷ
}
export type IRegisSMS = BaseDocument & {
  code?: string; // Mã đăng ký
  sellerId?: string; // Chủ shop
  productId?: string; // Sản phẩm SMS
  productName?: string; // Tên sản phẩm
  basePrice?: number; // Giá sản phẩm
  registerId?: string; // Khách hàng
  registerName?: string; // Tên khách hàng
  registerPhone?: string; // Điện thoại đăng ký
  status?: RegisSMSStatus; // Trạng thái
  commission0?: number; // Hoa hồng Mobifone
  commission1?: number; // Hoa hồng điểm bán
  commission2?: number; // Hoa hồng giới thiệu
  sellerBonusPoint?: number; // Điểm thường người bán
  buyerBonusPoint?: number; // Điểm thưởng người mua
  campaignId: string; // mã chiến dịch
  campaignSocialResultId: string // mã kết quả chiến dịch
};

const regisSMSSchema = new Schema(
  {
    code: { type: String, required: true },
    productName: { type: String, required: true },
    basePrice: { type: Number, default: 0, min: 0 },
    registerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    registerName: { type: String, required: true },
    registerPhone: { type: String, required: true },
    status: { type: String, enum: Object.values(RegisSMSStatus), default: RegisSMSStatus.PENDING },
    commission0: { type: Number, default: 0, min: 0 },
    commission1: { type: Number, default: 0, min: 0 },
    commission2: { type: Number, default: 0, min: 0 },
    sellerBonusPoint: { type: String, default: 0, min: 0 },
    buyerBonusPoint: { type: String, default: 0, min: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
    campaignSocialResultId: { type: Schema.Types.ObjectId, ref: "CampaignSocialResult" },
  },
  { timestamps: true }
);

regisSMSSchema.index(
  { phone: "text", code: "text", productName: "text" },
  { weights: { phone: 2, code: 2, productName: 1 } }
);
regisSMSSchema.index({ phone: 1 });
regisSMSSchema.index({ sellerId: 1 });
regisSMSSchema.index({ registerId: 1 });

export const RegisSMSHook = new ModelHook<IRegisSMS>(regisSMSSchema);
export const RegisSMSModel: mongoose.Model<IRegisSMS> = MainConnection.model(
  "RegisSMS",
  regisSMSSchema
);

export const RegisSMSLoader = ModelLoader<IRegisSMS>(RegisSMSModel, RegisSMSHook);
