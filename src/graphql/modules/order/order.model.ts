import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { DeliveryInfo, DeliveryInfoSchema } from "./types/deliveryInfo.type";
import { IOrderItem } from "../orderItem/orderItem.model";
const Schema = mongoose.Schema;

export enum OrderStatus {
  PENDING = "PENDING", // Chờ xử lý
  DELIVERING = "DELIVERING", // Đang vận chuyển
  COMPLETED = "COMPLETED", // Đã duyệt
  CANCELED = "CANCELED", // Đã huỷ
  RETURNED = "RETURNED" // Đã hoàn hàng
}

export enum PaymentMethod {
  NONE = "NONE", // Không thanh toán
  COD = "COD", // Thanh toán khi nhận hàng
  MOMO = "MOMO",
  BAOKIM = "BAOKIM",
  PAYPAL = "PAYPAL"
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
  items: IOrderItem[]; // danh sách sản phẩm trong đơn
  amount?: number; // Thành tiền
  subtotal?: number; // Tổng tiền hàng
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
  buyerAddress: string; // Địa chỉ khách hàng
  buyerProvince: string; // Tỉnh / thành
  buyerDistrict: string; // Quận / huyện
  buyerWard: string; // Phường / xã
  buyerProvinceId: string; // Mã Tỉnh / thành
  buyerDistrictId: string; // Mã Quận / huyện
  buyerWardId: string; // Mã Phường / xã
  sellerBonusPoint?: number; // Điểm thường người bán
  buyerBonusPoint?: number; // Điểm thưởng người mua
  fromMemberId: string; // Shoper bán chéo
  // delivery
  itemWeight: number;
  itemWidth: number; // chiều rộng
  itemLength: number; // chiều dài
  itemHeight: number; // chiều cao
  shipfee: number;
  deliveryInfo: DeliveryInfo;
  shipMethod?: ShipMethod;
  paymentMethod?: PaymentMethod;
  addressDeliveryId: string;
  productIds: string[];
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
    buyerAddress: { type: String},
    buyerProvince: { type: String},
    buyerDistrict: { type: String},
    buyerWard: { type: String },
    buyerProvinceId: { type: String},
    buyerDistrictId: { type: String},
    buyerWardId: { type: String },
    sellerBonusPoint: { type: Number, default: 0, min: 0 },
    buyerBonusPoint: { type: Number, default: 0, min: 0 },
    // delivery
    itemWeight: { type: Number, default: 0, min: 0 },
    itemWidth: { type: Number, default: 0 }, // chiều rộng
    itemLength: { type: Number, default: 0 }, // chiều dài
    itemHeight: { type: Number, default: 0 }, // chiều cao

    shipfee: { type: Number, default: 0, min: 0 },
    deliveryInfo: { type: DeliveryInfoSchema },
    shipMethod: {
      type: String,
      enum: Object.values(ShipMethod),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    subtotal: { type: Number, default: 0, min: 0 },
    itemCount: { type: Number, default: 0, min: 0 },
    addressDeliveryId:{ type: Schema.Types.ObjectId, ref: "AddressDelivery" },
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
