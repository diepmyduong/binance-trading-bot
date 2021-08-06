import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { OfferItem, OfferItemSchema } from "./types/offerItem.schema";
import { DiscountItem, DiscountItemSchema, DiscountUnit } from "./types/discountItem.schema";
const Schema = mongoose.Schema;
export enum ShopVoucherType {
  DISCOUNT_BILL = "DISCOUNT_BILL", // Giảm giá đơn
  DISCOUNT_ITEM = "DISCOUNT_ITEM", // Giảm giá sản phẩm
  OFFER_ITEM = "OFFER_ITEM", // Tặng sản phẩm
  SHIP_FEE = "SHIP_FEE", // Giảm phí ship
  SAME_PRICE = "SAME_PRICE", // Đồng giá
}
export type IShopVoucher = BaseDocument & {
  memberId?: string; // Mã chủ shop
  code?: string; // Mã khuyến mãi
  description?: string; // Mô tả
  isActive?: boolean; // Kích hoạt
  type?: ShopVoucherType; // Loại giảm giá
  issueNumber?: number; // Số lượng phát hành
  issueByDate?: boolean; // Phát hành mỗi ngày
  useLimit?: number; // Số lượng sử dụng / mỗi khách
  useLimitByDate?: boolean; // Số lượng sử dụng theo ngày
  discountUnit?: DiscountUnit; // Đơn vị giảm giá
  discountValue?: number; // Giá trị giảm giá
  maxDiscount?: number; // Giảm giá tối đa
  offerItems?: OfferItem[]; // Sản phẩm quà tặng
  discountItems?: DiscountItem[]; // Sản phẩm giảm giá
  applyItemIds?: string[]; // Các sản phẩm áp dụng
  exceptItemIds?: string[]; // Các sản phẩm không áp dụng
  minSubtotal?: number; // Tổng tiền hàng tối thiểu
  applyPaymentMethods?: string[]; // Phương thức thanh toán áp dụng
  minItemQty?: number; // Số lượng sản phẩm tối thiểu
  startDate?: Date; // Ngày bắt đầu
  endDate?: Date; // Ngày kết thúc
  isPrivate?: boolean; // Mã giảm giá riêng tư
  isPersonal?: boolean; // Mã giảm giá chỉ dành cho tặng cá nhân
  image?: string; // Hình ảnh
  content?: string; // Nội dung html
  samePrice?: number; // Đồng giá
};

const listProductSchema: any = {
  type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  default: [],
};
const shopVoucherSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    code: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: false },
    type: { type: String, enum: Object.values(ShopVoucherType), required: true },
    issueNumber: { type: Number, default: 0, min: 0 },
    issueByDate: { type: Boolean, default: false },
    useLimit: { type: Number, default: 0 },
    useLimitByDate: { type: Boolean, default: false },
    discountUnit: { type: String, enum: Object.values(DiscountUnit) },
    discountValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: 0, min: 0 },
    offerItems: { type: [OfferItemSchema], default: [] },
    discountItems: { type: [DiscountItemSchema], default: [] },
    applyItemIds: listProductSchema,
    exceptItemIds: listProductSchema,
    minSubtotal: { type: Number, default: 0, min: 0 },
    applyPaymentMethods: { type: [String], default: [] },
    minItemQty: { type: Number, default: 0, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isPrivate: { type: Boolean, default: false },
    isPersonal: { type: Boolean, default: false },
    image: { type: String },
    content: { type: String },
    samePrice: { type: Number },
  },
  { timestamps: true }
);

shopVoucherSchema.index({ memberId: 1, code: 1 }, { unique: true });
shopVoucherSchema.index({ code: "text" }, { weights: { code: 2 } });

export const ShopVoucherHook = new ModelHook<IShopVoucher>(shopVoucherSchema);
export const ShopVoucherModel: mongoose.Model<IShopVoucher> = MainConnection.model(
  "ShopVoucher",
  shopVoucherSchema
);

export const ShopVoucherLoader = ModelLoader<IShopVoucher>(ShopVoucherModel, ShopVoucherHook);
