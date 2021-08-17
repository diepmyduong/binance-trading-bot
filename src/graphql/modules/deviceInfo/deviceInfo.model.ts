import mongoose from "mongoose";
import { MainConnection } from "../../../helpers/mongo";
import { BaseDocument, ModelLoader } from "../../../base/model";
const Schema = mongoose.Schema;

export type IDeviceInfo = BaseDocument & {
  userId?: string; // Mã người dùng
  memberId?: string; // Mã chủ shop
  staffId?: string; // Mã nhân viên
  customerId?: string; // Mã khách hàng
  deviceId?: string; // Mã thiết bị
  deviceToken?: string; // Token thiết bị
};

const deviceInfoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    deviceId: { type: String },
    deviceToken: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

deviceInfoSchema.index({ userId: 1 });
deviceInfoSchema.index({ staffId: 1 });
deviceInfoSchema.index({ memberId: 1 });
deviceInfoSchema.index({ customerId: 1 });
// deviceInfoSchema.index({ name: "text" }, { weights: { name: 2 } });

export const DeviceInfoModel: mongoose.Model<IDeviceInfo> = MainConnection.model(
  "DeviceInfo",
  deviceInfoSchema
);

export const DeviceInfoLoader = ModelLoader<IDeviceInfo>(DeviceInfoModel);
