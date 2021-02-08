import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum CustomerPointLogType {
  RECEIVE_FROM_ORDER = "RECEIVE_FROM_ORDER", // Nhận từ đơn hàng
  // Khách hàng đăng ký 1 dịch vụ hoặc SMS có thể tính điểm thưởng nếu sản phẩm đó có allow
  RECEIVE_FROM_RESIS_SERVICE = "RECEIVE_FROM_RESIS_SERVICE", // Nhận từ DỊCH VỤ 
  RECEIVE_FROM_REGIS_SMS = "RECEIVE_FROM_REGIS_SMS", // Nhận từ SMS
  RECEIVE_FROM_INVITE = "RECEIVE_FROM_INVITE", // Nhận từ mời thành viên
  RECEIVE_FROM_LUCKY_WHEEL = "RECEIVE_FROM_LUCKY_WHEEL", // Nhận từ vòng quay may mắn
  PAY_TO_PLAY_LUCKY_WHEEL = "PAY_TO_PLAY_LUCKY_WHEEL", // Trả để xoay vòng quay may mắn
}
export type ICustomerPointLog = BaseDocument & {
  customerId?: string; // Mã thành viên
  value?: number; // Giá trị
  type?: CustomerPointLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  regisSMSId: string; // Mã đăng ký SMS
  regisServiceId: string; //Mã đăng ký dịch vụ
  luckyWheelResultId: string //Mã lịch sử quay vòng quay may mắn
};

const customerPointLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    value: { type: Number, required: true },
    type: { type: String, enum: Object.values(CustomerPointLogType) },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    regisSMSId: { type: Schema.Types.ObjectId, ref: "RegisSMS" },
    regisServiceId: { type: Schema.Types.ObjectId, ref: "RegisService" },
    luckyWheelResultId: { type: Schema.Types.ObjectId, ref: "LuckyWheelResult" },
  },
  { timestamps: true }
);
customerPointLogSchema.index({ customerId: 1 });
// customerPointLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CustomerPointLogHook = new ModelHook<ICustomerPointLog>(customerPointLogSchema);
export const CustomerPointLogModel: mongoose.Model<ICustomerPointLog> = MainConnection.model(
  "CustomerPointLog",
  customerPointLogSchema
);

export const CustomerPointLogLoader = ModelLoader<ICustomerPointLog>(
  CustomerPointLogModel,
  CustomerPointLogHook
);
