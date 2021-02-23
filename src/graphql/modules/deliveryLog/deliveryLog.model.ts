import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { ShipMethod } from "../order/order.model";
const Schema = mongoose.Schema;

export type IDeliveryLog = BaseDocument & {
  orderId?: string; // Mã đơn hàng
  customerId?: string; // Mã khách hàng
  orderCode?: string; // Mã vận đợn
  orderNumber?: string; // Mã vận đợn
  shipMethod?: ShipMethod; // Phương thức vận chuyển
  status?: string; // Trạng thái vận chuyển
  statusName?: string; // Thông tin trạng thái vận chuyển
  statusDetail?: string; // Thông tin vận chuyển chi tiết
  statusDate?: Date; // Ngày cập nhật trạng thái
  note?: string; // Ghi chú vận đơn
  moneyCollection?: number; // Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)
  moneyFeeCOD?: number; // Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)
  moneyTotal?: number; // Tổng tiền bao gồm VAT
  expectedDelivery?: string; // Thời gian ước tính hoàn thiện
  productWeight?: number; // Trọng lượng sản phẩm
  orderService?: string; // Dịch vụ giao hàng
  locationCurrently?: string; // Vị trí hiện tại
  detail?: string; // Chi tiết 
};

const deliveryLogSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderCode: { type: String, required: true },
    orderNumber: { type: String, required: true },
    shipMethod: { type: String, enum: Object.values(ShipMethod) },
    status: { type: String, required: true },
    statusName: { type: String },
    statusDetail: { type: String },
    statusDate: { type: Date },
    note: { type: String },
    moneyCollection: { type: Number, default: 0, min: 0 },
    moneyFeeCOD: { type: Number, default: 0, min: 0 },
    moneyTotal: { type: Number, default: 0, min: 0 },
    expectedDelivery: { type: String },
    productWeight: { type: Number },
    orderService: { type: String },
    locationCurrently: { type: String },
    detail: { type: String },
  },
  { timestamps: true }
);

deliveryLogSchema.index({ orderId: 1 });
// deliveryLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const DeliveryLogHook = new ModelHook<IDeliveryLog>(deliveryLogSchema);
export const DeliveryLogModel: mongoose.Model<IDeliveryLog> = MainConnection.model(
  "DeliveryLog",
  deliveryLogSchema
);

export const DeliveryLogLoader = ModelLoader<IDeliveryLog>(DeliveryLogModel, DeliveryLogHook);
