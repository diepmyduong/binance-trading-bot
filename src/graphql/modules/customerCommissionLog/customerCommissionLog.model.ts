import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum CustomerCommissionLogType {
  RECEIVE_COMMISSION_2_FROM_ORDER = "RECEIVE_COMMISSION_2_FROM_ORDER", // Hoa hồng nhận từ đơn hàng dành cho cộng tác viên
}

export type ICustomerCommissionLog = BaseDocument & {
  customerId: string; // Mã khách hàng
  memberId?: string;  // mã shop
  value?: number; // Giá trị
  type?: CustomerCommissionLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  collaboratorId: string; // Mã cộng tác viên
};

const customerCommissionLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    value: { type: Number, required: true },
    type: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
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
