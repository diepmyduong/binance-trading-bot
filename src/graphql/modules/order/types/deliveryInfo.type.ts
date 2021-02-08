import { Schema } from "mongoose";

export type DeliveryInfo = {
  date?: Date; // Ngày giao hàng
  storeId?: string; // Kho giao hàng
  serviceId?: string; // Mã Dịch vụ giao hàng
  serviceName?: string; // Tên dịch vụ giao hàng
  time?: string; // Thời gian dự kiến
  partnerFee?: number; // Phí giao hàng trả cho đối tác
  orderNumber?: string; // Mã vận đơn
  status?: string; // Trạng thái giao hàng
  statusName?: string; // Tên tình trạng
  note?: string; // Ghi chú giao hàng
  moneyCollection?: number; // Tiền thu hộ
  productName?: string; // Tên gói hàng
  productDesc?: string; // Mô tả gói hàng
  productWeight?: number; // Cân nặng
  productLength?: number; // Chiều dài
  productWidth?: number; // Chiều rộng
  productHeight?: number; // Chiều cao
  orderPayment?: 1 | 2 | 3 | 4; // Phương thức thu tiền
  orderVoucher?: string; // Voucher giao hàng
};

export const DeliveryInfoSchema = new Schema({
  date: { type: Date },
  storeId: { type: Schema.Types.ObjectId, ref: "Branch" },
  serviceId: { type: String },
  serviceName: { type: String },
  time: { type: String },
  partnerFee: { type: Number, min: 0, default: 0 },
  orderNumber: { type: String },
  status: { type: String },
  statusName: { type: String },
  note: { type: String },
  moneyCollection: { type: Number, min: 0 },
  productName: { type: String },
  productDesc: { type: String },
  productWeight: { type: Number },
  productLength: { type: Number },
  productWidth: { type: Number },
  productHeight: { type: Number },
  orderPayment: { type: Number, enum: [1, 2, 3, 4] },
  orderVoucher: { type: String },
});
