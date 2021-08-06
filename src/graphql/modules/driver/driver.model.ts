import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export enum DriverStatus {
  ONLINE = "ONLINE", // Đang trực tuyến
  OFFLINE = "OFFLINE", // Đang ngoại tuyến
  ACCEPTED = "ACCEPTED", // Đang nhận đơn
  DELIVERING = "DELIVERING", // Đang giao hàng
}

export type IDriver = BaseDocument & {
  memberId?: string; // Chủ shop
  name?: string; // Tên tài xế
  phone?: string; // Số điện thoại
  avatar?: string; // Hình đại diện
  licensePlates?: string; // Biển số xe
  status?: DriverStatus; // Trạng thái
  orderIds?: string[]; // Đơn hàng đang nhận, gần nhất
  isActive?: boolean; // Kích hoạt
};

const driverSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String },
    licensePlates: { type: String, required: true },
    status: { type: String, enum: Object.values(DriverStatus), default: DriverStatus.ONLINE },
    orderIds: { type: [{ type: Schema.Types.ObjectId, ref: "Order" }], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

driverSchema.index({ memberId: 1, phone: 1 }, { unique: true });
driverSchema.index(
  { name: "text", phone: "text", licensePlates: "text" },
  { weights: { name: 2, phone: 2, licensePlates: 2 } }
);

export const DriverHook = new ModelHook<IDriver>(driverSchema);
export const DriverModel: mongoose.Model<IDriver> = MainConnection.model("Driver", driverSchema);

export const DriverLoader = ModelLoader<IDriver>(DriverModel, DriverHook);
