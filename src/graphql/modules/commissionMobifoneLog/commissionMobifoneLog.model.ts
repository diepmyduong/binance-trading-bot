import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum CommissionMobifoneLogType {
  RECEIVE_COMMISSION_0_FROM_ORDER = "RECEIVE_COMMISSION_0_FROM_ORDER", // Hoa hồng nhận từ đơn hàng dành cho Chủ shop
  RECEIVE_COMMISSION_0_FROM_REGI_SERVICE = "RECEIVE_COMMISSION_0_FROM_REGI_SERVICE", // Hoa hồng nhận từ dịch vụ đăng ký dành cho Chủ shop
  RECEIVE_COMMISSION_0_FROM_SMS = "RECEIVE_COMMISSION_0_FROM_SMS", // Hoa hồng nhận từ dịch vụ tin nhắn dành cho Chủ shop 
}

export type ICommissionMobifoneLog = BaseDocument & {
  value?: number; // Giá trị
  type?: CommissionMobifoneLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  regisSMSId: string; // Mã đăng ký SMS
  regisServiceId: string; //Mã đăng ký dịch vụ
};

const commissionMobifoneLogSchema = new Schema(
  {
    value: { type: Number, required: true },
    type: { type: String, enum: Object.values(CommissionMobifoneLogType), required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    regisSMSId: { type: Schema.Types.ObjectId, ref: "RegisSMS" },
    regisServiceId: { type: Schema.Types.ObjectId, ref: "RegisService" },
  },
  { timestamps: true }
);
commissionMobifoneLogSchema.index({ memberId: 1 });

// commissionMobifoneLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CommissionMobifoneLogHook = new ModelHook<ICommissionMobifoneLog>(commissionMobifoneLogSchema);
export const CommissionMobifoneLogModel: mongoose.Model<ICommissionMobifoneLog> = MainConnection.model(
  "CommissionMobifoneLog",
  commissionMobifoneLogSchema
);

export const CommissionMobifoneLogLoader = ModelLoader<ICommissionMobifoneLog>(CommissionMobifoneLogModel, CommissionMobifoneLogHook);
