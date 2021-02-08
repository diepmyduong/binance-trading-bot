import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum AgencyType { // loại đại lý
  MOBIFONE = "MOBIFONE",  // mobifone
  SHOPPER = "SHOPPER", // chủ cửa hàng
}
export enum WheelStatus {  // trạng thái vòng xoay
  OPEN = 'OPEN', // đang mở
  CLOSED = 'CLOSED', // đã đóng
}

export type Gift = {
  name: string;
  desc: string;
  code: string;
  image: string;
  amount: number;
  used: number;
  type: string;
}
export type ILuckyWheel = BaseDocument & {
  code: string; // Mã vòng quay
  title: string; // Tiêu đề vòng quay
  backgroundColor: string;// màu nền vòng quay
  backgroundImage: string;// hình nền vòng quay
  buttonColor: string; // màu nút
  bannerImage: string;// ảnh banner
  footerImage: string; // ảnh footer
  wheelImage: string;// ảnh vòng quay
  pinImage: string; // ảnh pin
  btnTitle: string;// tên nút
  startDate: Date;// ngày bắt đầu
  endDate: Date;// ngày kết thúc
  successRatio: number;// tỉ lệ thắng
  gamePointRequired: number; // Điểm chơi game được yêu cầu
  giftIds: string[]; // danh sách món quà
  memberId: string; // Mã chủ shop
  agencyType?: AgencyType; // loại đại lý
  status?: WheelStatus; // trạng thái vòng xoay
  designConfig?: any; // Cấu hình thiết kế vòng quay
  limitTimes: number; //Giới hạn số lần quay
};

const luckyWheelSchema = new Schema(
  {
    code: { type: String, unique: true, required: true }, // Mã vòng quay
    title: { type: String }, // Tiêu đề vòng quay
    backgroundColor: { type: String }, // màu nền vòng quay
    backgroundImage: { type: String }, // hình nền vòng quay
    buttonColor: { type: String }, // màu nút
    bannerImage: { type: String }, // ảnh banner
    footerImage: { type: String }, // ảnh footer
    wheelImage: { type: String }, // ảnh vòng quay
    pinImage: { type: String }, // ảnh pin
    btnTitle: { type: String }, // tên nút
    startDate: { type: Date }, // ngày bắt đầu
    endDate: { type: Date }, // ngày kết thúc
    successRatio: { type: Number, default: 15 }, // tỉ lệ thắng
    gamePointRequired: { type: Number, default: 0 }, // điểm chơi game được yêu cầu
    memberId: { type: Schema.Types.ObjectId, ref: "Member" }, //mã người tạo
    giftIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "LuckyWheelGift" }],
      minlength: 1,
      required: true,
    }, // danh sách món quà
    agencyType: { type: String, enum: Object.values(AgencyType), default: AgencyType.MOBIFONE }, // loại đại lý
    status: { type: String, enum: Object.values(WheelStatus), default: WheelStatus.OPEN }, // trạng thái vòng xoay
    designConfig: { type: Schema.Types.Mixed }, //Cấu hình thiết kế vòng quay
    limitTimes: { type: Number, default: 0 }, // Giới hạn số lần quay
  },
  { timestamps: true }
);

// luckyWheelSchema.index({ name: "text" }, { weights: { name: 2 } });

export const LuckyWheelHook = new ModelHook<ILuckyWheel>(luckyWheelSchema);
export const LuckyWheelModel: mongoose.Model<ILuckyWheel> = MainConnection.model(
  "LuckyWheel",
  luckyWheelSchema
);

export const LuckyWheelLoader = ModelLoader<ILuckyWheel>(LuckyWheelModel, LuckyWheelHook);
