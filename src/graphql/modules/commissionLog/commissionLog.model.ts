import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum CommissionLogType {
  RECEIVE_COMMISSION_1_FROM_ORDER = "RECEIVE_COMMISSION_1_FROM_ORDER", // Hoa hồng nhận từ đơn hàng dành cho Chủ shop
  RECEIVE_COMMISSION_2_FROM_ORDER = "RECEIVE_COMMISSION_2_FROM_ORDER", // Hoa hồng nhận từ đơn hàng dành cho người giới thiệu Chủ shop  

  RECEIVE_COMMISSION_1_FROM_REGI_SERVICE = "RECEIVE_COMMISSION_1_FROM_REGI_SERVICE", // Hoa hồng nhận từ dịch vụ đăng ký dành cho Chủ shop
  RECEIVE_COMMISSION_2_FROM_REGI_SERVICE = "RECEIVE_COMMISSION_2_FROM_REGI_SERVICE",// Hoa hồng nhận từ dịch vụ đăng ký dành cho người giới thiệu Chủ shop  

  RECEIVE_COMMISSION_1_FROM_SMS = "RECEIVE_COMMISSION_1_FROM_SMS", // Hoa hồng nhận từ dịch vụ tin nhắn dành cho Chủ shop 
  RECEIVE_COMMISSION_2_FROM_SMS = "RECEIVE_COMMISSION_2_FROM_SMS",// Hoa hồng nhận từ dịch vụ tin nhắn dành cho người giới thiệu Chủ shop  
}
export type ICommissionLog = BaseDocument & {
  memberId?: string; // Mã thành viên
  value?: number; // Giá trị
  type?: CommissionLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  regisSMSId: string; // Mã đăng ký SMS
  regisServiceId: string; //Mã đăng ký dịch vụ
};

const commissionLogSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    value: { type: Number, required: true },
    type: { type: String, enum: Object.values(CommissionLogType), required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Member" },
    regisSMSId: { type: Schema.Types.ObjectId, ref: "RegisSMS" },
    regisServiceId: { type: Schema.Types.ObjectId, ref: "RegisService" },
  },
  { timestamps: true }
);
commissionLogSchema.index({ memberId: 1 });
// commissionLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CommissionLogHook = new ModelHook<ICommissionLog>(commissionLogSchema);
export const CommissionLogModel: mongoose.Model<ICommissionLog> = MainConnection.model(
  "CommissionLog",
  commissionLogSchema
);

export const CommissionLogLoader = ModelLoader<ICommissionLog>(
  CommissionLogModel,
  CommissionLogHook
);
