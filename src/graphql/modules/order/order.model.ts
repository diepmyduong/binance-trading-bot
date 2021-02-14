import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { DeliveryInfoSchema } from "./types/deliveryInfo.type";
const Schema = mongoose.Schema;
export enum OrderStatus {
  PENDING = "PENDING", // Chờ xử lý
  DELIVERING = "DELIVERING", // Đang vận chuyển
  COMPLETED = "COMPLETED", // Đã duyệt
  CANCELED = "CANCELED", // Đã huỷ
}
export enum ShipMethod {
  POST = "POST", // Nhận hàng tại chi nhánh
  VNPOST = "VNPOST", // Vietnam Post
  NONE = "NONE", // Không vận chuyển
}
export type IOrder = BaseDocument & {
  code?: string; // Mã đơn hàng
  isPrimary?: boolean; // Đơn Mobifone
  itemIds?: string[]; // Danh sách sản phẩm
  amount?: number; // Thành tiền
  subTotal?: number; // Tổng tiền hàng
  itemCount?: number; // Số lượng sản phẩm
  sellerId?: string; // Chủ shop bán
  status?: OrderStatus; // Trạng thái
  updatedByUserId?: string; // Người cập nhật
  commission0?: number; // Hoa hồng Mobifone
  commission1?: number; // Hoa hồng điểm bán
  commission2?: number; // Hoa hồng giới thiệu
  buyerId?: string; // Khách hàng mua
  buyerName?: string; // Tên khách hàng
  buyerPhone?: string; // Điện thoại khách hàng
  buyerAddress?: string; // Địa chỉ khách hàng
  buyerProvince?: string; // Tỉnh / thành
  buyerDistrict?: string; // Quận / huyện
  buyerWard?: string; // Phường / xã
  buyerProvinceId?: string; // Mã Tỉnh / thành
  buyerDistrictId?: string; // Mã Quận / huyện
  buyerWardId?: string; // Mã Phường / xã
  sellerBonusPoint?: number; // Điểm thường người bán
  buyerBonusPoint?: number; // Điểm thưởng người mua
  fromMemberId: string; // Shoper bán chéo
};

const orderSchema = new Schema(
  {
    code: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    itemIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
      minlength: 1,
      required: true,
    },
    amount: { type: Number, default: 0, min: 0 },
    subTotal: { type: Number, default: 0, min: 0 },
    itemCount: { type: Number, default: 0, min: 0 },

    sellerId: { type: Schema.Types.ObjectId, ref: "Member" },
    fromMemberId: { type: Schema.Types.ObjectId, ref: "Member" },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    updatedByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    commission0: { type: Number, default: 0, min: 0 },
    commission1: { type: Number, default: 0, min: 0 },
    commission2: { type: Number, default: 0, min: 0 },
    buyerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    buyerProvince: { type: String, required: true },
    buyerDistrict: { type: String, required: true },
    buyerWard: { type: String },
    buyerProvinceId: { type: String, required: true },
    buyerDistrictId: { type: String, required: true },
    buyerWardId: { type: String },
    sellerBonusPoint: { type: Number, default: 0, min: 0 },
    buyerBonusPoint: { type: Number, default: 0, min: 0 },
    // delivery
    itemWeight: { type: Number, default: 0, min: 0 },
    shipfee: { type: Number, default: 0, min: 0 },
    deliveryInfo: { type: DeliveryInfoSchema },
    shipMethod: { type: String, enum: Object.values(ShipMethod), required: true },

  },
  { timestamps: true }
);

orderSchema.index({ code: "text" }, { weights: { code: 2 } });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ isPrimary: 1 });
orderSchema.index({ buyerId: 1 });

export const OrderHook = new ModelHook<IOrder>(orderSchema);
export const OrderModel: mongoose.Model<IOrder> = MainConnection.model(
  "Order",
  orderSchema
);

export const OrderLoader = ModelLoader<IOrder>(OrderModel, OrderHook);
