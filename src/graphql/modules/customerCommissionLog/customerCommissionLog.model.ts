import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum CustomerCommissionLogType {
  RECEIVE_COMMISSION_2_FROM_ORDER = "RECEIVE_COMMISSION_2_FROM_ORDER", // Hoa hồng nhận từ đơn hàng dành cho cộng tác viên
  RECEIVE_COMMISSION_2_FROM_REGI_SERVICE = "RECEIVE_COMMISSION_2_FROM_REGI_SERVICE", // hoa hồng nhận từ dịch vụ dành cho cộng tác viên
  RECEIVE_COMMISSION_2_FROM_SMS = "RECEIVE_COMMISSION_2_FROM_SMS"
}

export type ICustomerCommissionLog = BaseDocument & {
  customerId?: string; // Mã khách hàng
  memberId?: string;  // mã shop
  value?: number; // Giá trị
  type?: CustomerCommissionLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  regisSMSId: string; // Mã đăng ký SMS
  regisServiceId: string; //Mã đăng ký dịch vụ
};

const customerCommissionLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    value: { type: Number, required: true },
    type: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    regisSMSId: { type: Schema.Types.ObjectId, ref: "RegisSMS" },
    regisServiceId: { type: Schema.Types.ObjectId, ref: "RegisService" },
  },
  { timestamps: true }
);

// customerCommissionLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CustomerCommissionLogHook = new ModelHook<ICustomerCommissionLog>(customerCommissionLogSchema);
export const CustomerCommissionLogModel: mongoose.Model<ICustomerCommissionLog> = MainConnection.model(
  "CustomerCommissionLog",
  customerCommissionLogSchema
);

export const CustomerCommissionLogLoader = ModelLoader<ICustomerCommissionLog>(CustomerCommissionLogModel, CustomerCommissionLogHook);
