import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { DeliveryInfo, DeliveryInfoSchema } from "./types/deliveryInfo.type";
import { IOrderItem } from "../orderItem/orderItem.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
const Schema = mongoose.Schema;

export enum OrderStatus {
  PENDING = "PENDING", // Chờ xử lý
  CONFIRMED = "CONFIRMED", // Xác nhận
  DELIVERING = "DELIVERING", // Đang vận chuyển
  COMPLETED = "COMPLETED", // Đã thành công
  CANCELED = "CANCELED", // Đã huỷ
  RETURNED = "RETURNED", // Đã hoàn hàng
  FAILURE = "FAILURE", // Thất bại
}

export enum PaymentMethod {
  NONE = "NONE", // Không thanh toán
  COD = "COD", // Thanh toán khi nhận hàng
  MOMO = "MOMO",
  BAOKIM = "BAOKIM",
  PAYPAL = "PAYPAL",
}

export enum ShipMethod {
  POST = "POST", // Nhận hàng tại chi nhánh
  VNPOST = "VNPOST", // Vietnam Post
  NONE = "NONE", // Không vận chuyển
}
export enum OrderType {
  POST = "POST", // Đơn bưu điện,
  SHOP = "SHOP", // Đơn bưu cục,
  CROSSSALE = "CROSSSALE", // Bán chéo,
}
export enum PickupMethod {
  DELIVERY = "DELIVERY", // Giao hàng
  STORE = "STORE", // Nhận tại cửa hàng
}

// export const ShipMethods = [
//   { label: "Tự liên hệ", value: ShipMethod.NONE },
//   { label: "Nhận hàng tại chi nhánh", value: ShipMethod.POST },
//   { label: "Giao hàng VNPost", value: ShipMethod.VNPOST },
// ];

export const getShipMethods = async () => {
  const [noneLabel, postLabel, vnpostLabel] = await Promise.all([
    SettingHelper.load(SettingKey.DELIVERY_NONE_LABEL),
    SettingHelper.load(SettingKey.DELIVERY_POST_LABEL),
    SettingHelper.load(SettingKey.DELIVERY_VNPOST_LABEL),
  ]);

  return [
    { label: noneLabel, value: ShipMethod.NONE },
    { label: postLabel, value: ShipMethod.POST },
    { label: vnpostLabel, value: ShipMethod.VNPOST },
  ];
};

export type IOrder = BaseDocument & {
  code?: string; // Mã đơn hàng
  isPrimary?: boolean; // Đơn Mobifone
  isCrossSale?: boolean; // Đơn bán chéo
  itemIds?: string[]; // Danh sách sản phẩm
  items?: IOrderItem[]; // danh sách sản phẩm trong đơn
  amount?: number; // Thành tiền
  subtotal?: number; // Tổng tiền hàng
  toppingAmount?: number; // Tổng tiền topping
  itemCount?: number; // Số lượng sản phẩm
  sellerId?: string; // Chủ shop bán
  sellerCode?: string; // Mã chủ shop bán
  sellerName?: string; // Chủ shop bán
  status?: OrderStatus; // Trạng thái
  commission0?: number; // Hoa hồng Mobifone
  commission1?: number; // Hoa hồng điểm bán
  commission2?: number; // Hoa hồng giới thiệu
  commission3?: number; // Hoa hồng giới thiệu
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
  fromMemberId?: string; // Shoper bán chéo
  // delivery
  itemWeight?: number;
  itemWidth?: number; // chiều rộng
  itemLength?: number; // chiều dài
  itemHeight?: number; // chiều cao
  shipfee?: number;
  deliveryInfo?: DeliveryInfo;
  shipMethod?: ShipMethod;
  paymentMethod?: PaymentMethod;
  productIds?: string[];
  oldAddressStorehouseId?: string; // Mã kho cũ
  addressStorehouseId?: string; // Mã kho
  oldAddressDeliveryId?: string; // Mã điểm nhận cũ
  addressDeliveryId?: string; // Mã điểm nhận
  isUrbanDelivery?: boolean;
  collaboratorId?: string;
  note?: string;
  toMemberNote?: string;
  toMemberId?: string; // Bưu cục được chuyển đơn
  longitude?: string;
  latitude?: string;
  orderLogIds?: string[];
  isLate?: boolean; // Đơn Mobifone
  finishedAt?: Date;
  loggedAt?: Date;
  campaignCode?: string;
  orderType?: OrderType;
  driverId?: string; // Mã tài xế
  driverName?: string; // Tên tài xế
  driverPhone?: string; // Điện thoại tài xế
  driverLicense?: string; // Biển số xe tài xế

  pickupMethod?: PickupMethod; // Phương thức nhận hàng
  pickupTime?: Date; // Thời gian nhận hàng
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
    subtotal: { type: Number, default: 0, min: 0 },
    toppingAmount: { type: Number, default: 0, min: 0 },
    itemCount: { type: Number, default: 0, min: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "Member" },
    sellerCode: { type: String }, // Mã chủ shop bán
    sellerName: { type: String }, // Chủ shop bán
    fromMemberId: { type: Schema.Types.ObjectId, ref: "Member" },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    commission0: { type: Number, default: 0, min: 0 },
    commission1: { type: Number, default: 0, min: 0 },
    commission2: { type: Number, default: 0, min: 0 },
    commission3: { type: Number, default: 0, min: 0 },
    buyerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerAddress: { type: String },
    buyerProvince: { type: String },
    buyerDistrict: { type: String },
    buyerWard: { type: String },
    buyerProvinceId: { type: String },
    buyerDistrictId: { type: String },
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

    oldAddressStorehouseId: { type: Schema.Types.ObjectId, ref: "AddressStorehouse" },
    addressStorehouseId: { type: Schema.Types.ObjectId, ref: "AddressStorehouse" },

    oldAddressDeliveryId: { type: Schema.Types.ObjectId, ref: "AddressDelivery" },
    addressDeliveryId: { type: Schema.Types.ObjectId, ref: "AddressDelivery" },

    isUrbanDelivery: { type: Boolean, default: false },
    collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    note: { type: Schema.Types.String },
    toMemberNote: { type: Schema.Types.String },
    // chuyển đơn cho member khác xử lý
    toMemberId: { type: Schema.Types.ObjectId, ref: "Member" },
    longitude: { type: Schema.Types.String },
    latitude: { type: Schema.Types.String },
    orderLogIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "OrderLog" }],
      default: [],
    },
    isLate: { type: Boolean },
    finishedAt: { type: Schema.Types.Date },
    loggedAt: { type: Schema.Types.Date },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      default: OrderType.POST,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    driverName: { type: String },
    driverPhone: { type: String },
    driverLicense: { type: String },
  },
  { timestamps: true }
);

orderSchema.index(
  {
    code: "text",
    buyerName: "text",
    buyerPhone: "text",
  },
  {
    weights: {
      code: 2,
      buyerName: 3,
      buyerPhone: 3,
    },
  }
);
orderSchema.index({ sellerId: 1 });
orderSchema.index({ isPrimary: 1 });
orderSchema.index({ buyerId: 1 });

export const OrderHook = new ModelHook<IOrder>(orderSchema);
export const OrderModel: mongoose.Model<IOrder> = MainConnection.model("Order", orderSchema);

export const OrderLoader = ModelLoader<IOrder>(OrderModel, OrderHook);
