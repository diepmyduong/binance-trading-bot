import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gift, GiftSchema } from "./gift.graphql";
const Schema = mongoose.Schema;
export type ILuckyWheel = BaseDocument & {
  memberId?: string; // Mã chủ shop
  code?: string; // Mã vòng quay
  title?: string; // Tiêu đề vòng quay
  backgroundColor?: string; // màu nền vòng quay
  backgroundImage?: string; // hình nền vòng quay
  buttonColor?: string; // màu nút
  bannerImage?: string; // ảnh banner
  footerImage?: string; // ảnh footer
  wheelImage?: string; // ảnh vòng quay
  pinImage?: string; // ảnh pin
  btnTitle?: string; // tiêu đề nút quay
  startDate?: Date; // ngày bắt đầu
  endDate?: Date; // ngày kết thúc
  successRatio?: number; // tỉ lệ thắng
  gamePointRequired?: number; // Điểm chơi game được yêu cầu
  gifts: Gift[]; // danh sách món quà
  isActive?: boolean; // Kích hoạt
  designConfig?: any; // Cấu hình thiết kế vòng quay
  issueNumber?: number; // Số lượng phát hành
  issueByDate?: boolean; // Phát hành mỗi ngày
  useLimit?: number; // Số lượng sử dụng / mỗi khách
  useLimitByDate?: boolean; // Số lượng sử dụng theo ngày
  isPrivate?: boolean; // Vong quay riêng tư
  issued?: number; // Đã phát hành
  issuedByDate?: number; // Đã phát hành trong ngày
  issuedDate?: Date; // Ngày cập nhật
};

const luckyWheelSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    backgroundColor: { type: String },
    backgroundImage: { type: String },
    buttonColor: { type: String },
    bannerImage: { type: String },
    footerImage: { type: String },
    wheelImage: { type: String },
    pinImage: { type: String },
    btnTitle: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    successRatio: { type: Number, default: 50, min: 0 },
    gamePointRequired: { type: Number, default: 0, min: 0 },
    gifts: { type: [GiftSchema], default: [] },
    isActive: { type: Boolean, default: false },
    designConfig: { type: Schema.Types.Mixed },
    issueNumber: { type: Number, default: 0, min: 0 },
    issueByDate: { type: Boolean, default: false },
    useLimit: { type: Number, default: 0, min: 0 },
    useLimitByDate: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    issued: { type: Number, default: 0 },
    issuedByDate: { type: Number, default: 0 },
    issuedDate: { type: Date },
  },
  { timestamps: true }
);

luckyWheelSchema.index({ memberId: 1, code: 1 }, { unique: true });
luckyWheelSchema.index({ title: "text" }, { weights: { title: 2 } });

export const LuckyWheelHook = new ModelHook<ILuckyWheel>(luckyWheelSchema);
export const LuckyWheelModel: mongoose.Model<ILuckyWheel> = MainConnection.model(
  "LuckyWheel",
  luckyWheelSchema
);

export const LuckyWheelLoader = ModelLoader<ILuckyWheel>(LuckyWheelModel, LuckyWheelHook);
