import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum GiftType {  // Loại quà
  CUMMULATIVE_POINT = 'CUMMULATIVE_POINT', // điểm tích lủy
  DILIGENCE_POINT = 'DILIGENCE_POINT', // điểm chuyên cần
  COMMISSION = 'COMMISSION', // Hoa hồng
  PRESENT = 'PRESENT', // Quà tặng
  EVOUCHER = 'EVOUCHER', // Quà tặng
  NOTHING = 'NOTHING' // Không tặng quà
}
export type ILuckyWheelGift = BaseDocument & {
  code: string, // mã quà
  name?: string, // tên quà
  desc: string, // diển giải
  image: string, // hình ảnh quà
  payPresent: string,// phần thưởng
  payPoint: number,// điểm trả thưởng
  qty: number, // số lượng
  usedQty: number, // đã sử dụng
  position: number,// vị trí
  luckyWheelId: string, // mã vòng quay
  eVoucherId: string // mã eVoucher
  type?: GiftType // loại quà
};

const luckyWheelGiftSchema = new Schema(
  {
    code: { type: String, required: true }, // mã quà
    name: { type: String }, // tên quà
    desc: { type: String },  // diển giải
    image: { type: String }, // hình ảnh quà
    payPresent: { type: String }, // phần thưởng
    payPoint: { type: Number, default: 0 }, // điểm trả thưởng
    qty: { type: Number, default: 0 }, // số lượng
    usedQty: { type: Number, default: 0 }, // đã sử dụng
    position: { type: Number, default: 0 }, // vị trí
    luckyWheelId: { type: Schema.Types.ObjectId, ref: "LuckyWheel" }, //mã vòng quay
    eVoucherId: { type: Schema.Types.ObjectId, ref: "EVoucher" }, //mã evoucher
    type: { type: String, enum: Object.values(GiftType), default: GiftType.NOTHING } // loại quà
  },
  { timestamps: true }
);

// luckyWheelGiftSchema.index({ name: "text" }, { weights: { name: 2 } });

export const LuckyWheelGiftHook = new ModelHook<ILuckyWheelGift>(luckyWheelGiftSchema);
export const LuckyWheelGiftModel: mongoose.Model<ILuckyWheelGift> = MainConnection.model(
  "LuckyWheelGift",
  luckyWheelGiftSchema
);

export const LuckyWheelGiftLoader = ModelLoader<ILuckyWheelGift>(LuckyWheelGiftModel, LuckyWheelGiftHook);
