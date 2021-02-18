import { Schema } from "mongoose";

export type DeliveryInfo = {
  date?: Date; // Ngày giao hàng
  addressStorehouseId?: string; // Kho giao hàng
  serviceId?: string; // Mã Dịch vụ giao hàng
  serviceName?: string; // Tên dịch vụ giao hàng
  time?: string; // Thời gian dự kiến
  partnerFee?: number; // Phí giao hàng trả cho đối tác
  orderNumber?: string; // Mã vận đơn
  status?: string; // Trạng thái giao hàng
  statusName?: string; // Tên tình trạng
  note?: string; // Ghi chú giao hàng
  moneyCollection?: number; // Tiền thu hộ
  productName?: string; // Nội dung hàng hóa
  productWeight?: number; // Cân nặng
  productLength?: number; // Chiều dài
  productWidth?: number; // Chiều rộng
  productHeight?: number; // Chiều cao
  isPackageViewable: boolean, // Có cho xem hàng
  hasMoneyCollection: boolean, // Giao hàng thu tiền (COD)
  showOrderAmount: boolean, //khai giá,
  hasReport: boolean, // báo phát
  hasInvoice: boolean, // dịch vụ hóa đơn
};

export const DeliveryInfoSchema = new Schema({
  date: { type: Date },
  addressStorehouseId: { type: Schema.Types.ObjectId, ref: "AddressStorehouse" },
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
  productWeight: { type: Number },
  productLength: { type: Number },
  productWidth: { type: Number },
  productHeight: { type: Number },
  hasMoneyCollection:  { type: Boolean, default:true }, // thu tiền ko
  isPackageViewable:  { type: Boolean, default:false }, // Có cho xem hàng
  showOrderAmount:  { type: Boolean, default:false }, //khai giá,
  hasReport:  { type: Boolean, default:false }, // báo phát
  hasInvoice:  { type: Boolean, default:false }, // dịch vụ hóa đơn
});
