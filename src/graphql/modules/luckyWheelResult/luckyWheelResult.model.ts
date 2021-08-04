import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { GiftType } from "../luckyWheelGift/luckyWheelGift.model";
const Schema = mongoose.Schema;
export enum SpinStatus { // trạng thái vòng xoay
  PENDING = "PENDING", // đang quay
  WIN = "WIN", // thắng
  LOSE = "LOSE", // thua
  ERROR = "ERROR", // lổi
}
export type ILuckyWheelResult = BaseDocument & {
  code: string; // mã quà
  giftId?: string; // mã quà của vòng quay
  giftName?: string; // tên quà của vòng quay
  gamePointUsed?: number; // số lượng điểm chơi game đã sử dụng
  customerId?: string; //mã khách hàng
  luckyWheelId?: string; //mã vòng quay
  payPoint?: number; // điểm trả thưởng
  memberId: string; //mã shop , nhân viên
  eVoucherId: string;
  eVoucherItemId: string;
  eVoucherCode: string;
  giftType: GiftType;
  status?: SpinStatus; // tình trạng lần quay này
};

const luckyWheelResultSchema = new Schema(
  {
    code: { type: String }, // mã quà
    giftId: { type: Schema.Types.ObjectId, ref: "LuckyWheelGift" }, //id quà vòng quay
    giftName: { type: String }, // tên quà của vòng quay
    gamePointUsed: { type: Number }, // số lượng điểm chơi game đã sử dụng
    payPoint: { type: Number }, // điểm trả thưởng

    luckyWheelId: { type: Schema.Types.ObjectId, ref: "LuckyWheel" }, //mã vòng quay
    memberId: { type: Schema.Types.ObjectId, ref: "Member" }, //mã shop , nhân viên
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" }, //mã khách hàng
    eVoucherId: { type: Schema.Types.ObjectId, ref: "EVoucher" }, //mã eVoucher
    eVoucherItemId: { type: Schema.Types.ObjectId, ref: "EVoucherItem" }, //mã eVoucher item
    eVoucherCode: { type: String },

    giftType: { type: String, enum: Object.values(GiftType), default: GiftType.NOTHING }, // loại quà
    status: { type: String, enum: Object.values(SpinStatus), default: SpinStatus.PENDING }, //tình trạng
  },
  { timestamps: true }
);

luckyWheelResultSchema.index({ status: 1 });

export const LuckyWheelResultHook = new ModelHook<ILuckyWheelResult>(luckyWheelResultSchema);
export const LuckyWheelResultModel: mongoose.Model<ILuckyWheelResult> = MainConnection.model(
  "LuckyWheelResult",
  luckyWheelResultSchema
);

export const LuckyWheelResultLoader = ModelLoader<ILuckyWheelResult>(
  LuckyWheelResultModel,
  LuckyWheelResultHook
);
