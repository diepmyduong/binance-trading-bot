import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum CumulativePointLogType {
  RECEIVE_FROM_ORDER = "RECEIVE_FROM_ORDER", // Nhận từ đơn hàng
  RECEIVE_FROM_RESIS_SERVICE = "RECEIVE_FROM_RESIS_SERVICE", // Nhận từ DỊCH VỤ 
  RECEIVE_FROM_REGIS_SMS = "RECEIVE_FROM_REGIS_SMS", // Nhận từ SMS
  RECEIVE_FROM_INVITE = "RECEIVE_FROM_INVITE", // Nhận từ mời thành viên
  RECEIVE_FROM_LUCKY_WHEEL_MOBIFONE = "RECEIVE_FROM_LUCKY_WHEEL_MOBIFONE", // Nhận từ vòng quay may mắn mobifone
  RECEIVE_FROM_LUCKY_WHEEL_SHOPPER = "RECEIVE_FROM_LUCKY_WHEEL_SHOPPER", // Nhận từ vòng quay may mắn chủ shop
}
export type ICumulativePointLog = BaseDocument & {
  memberId?: string; // Mã thành viên
  value?: number; // Giá trị
  type?: CumulativePointLogType; // Loại sự kiện
  orderId: string; // Mã đơn hàng
  regisSMSId: string; // Mã đăng ký SMS
  regisServiceId: string; //Mã đăng ký dịch vụ
};

const cumulativePointLogSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    value: { type: Number, required: true },
    type: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    regisSMSId: { type: Schema.Types.ObjectId, ref: "RegisSMS" },
    regisServiceId: { type: Schema.Types.ObjectId, ref: "RegisService" },
  },
  { timestamps: true }
);
cumulativePointLogSchema.index({ memberId: 1 });
// cumulativePointLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CumulativePointLogHook = new ModelHook<ICumulativePointLog>(cumulativePointLogSchema);
export const CumulativePointLogModel: mongoose.Model<ICumulativePointLog> = MainConnection.model(
  "CumulativePointLog",
  cumulativePointLogSchema
);

export const CumulativePointLogLoader = ModelLoader<ICumulativePointLog>(
  CumulativePointLogModel,
  CumulativePointLogHook
);
