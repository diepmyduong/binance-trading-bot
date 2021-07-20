import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gender } from "../member/member.model";
export enum CustomerRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}

const Schema = mongoose.Schema;
export type CustomerPageAccount = {
  psid?: string; // PSID người dùng
  pageId?: string; // ID của Fanpage
  memberId?: string; // Mã thành viên
};
const customerPageAccountSchema = new Schema({
  psid: { type: String },
  pageId: { type: String },
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
});

export type ICustomer = BaseDocument & {
  memberId?: string; // Mã chủ shop
  code?: string; // Mã khách hàng
  name?: string; // Tên khách hàng
  facebookName?: string; // Tên facebook
  uid?: string; // UID
  phone?: string; // Số điện thoại
  password?: string; // Mã pin
  avatar?: string; // Avatar
  gender?: Gender; // Giới tính
  birthday?: Date; // Ngày sinh
  address?: string; // Địa chỉ
  fullAddress?: string; // Full địa chỉ
  addressNote?: string; // Ghi chú địa chỉ
  province?: string; // Tỉnh / thành
  district?: string; // Quận / huyện
  ward?: string; // Phường / xã
  provinceId?: string; // Mã Tỉnh / thành
  districtId?: string; // Mã Quận / huyện
  wardId?: string; // Mã Phường / xã
  cumulativePoint?: number; // Điểm tích lũy
  commission: number; // Hoa hồng cộng tác viên
  pageAccounts?: CustomerPageAccount[]; // Danh sách account facebook của người dùng
  latitude: number;
  longitude: number;
};

const customerSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    facebookName: { type: String },
    uid: { type: String },
    phone: { type: String, required: true },
    password: { type: String },
    avatar: { type: String },
    gender: { type: String, enum: Object.values(Gender), default: Gender.OTHER },
    birthday: { type: Date },
    address: { type: String },
    fullAddress: { type: String },
    addressNote: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    cumulativePoint: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    pageAccounts: { type: [customerPageAccountSchema], default: [] },

    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

customerSchema.index({ phone: 1, memberId: 1 }, { unique: true });

customerSchema.index(
  { name: "text", code: "text", facebookName: "text", phone: "text" },
  { weights: { name: 2, code: 2, facebookName: 2, phone: 1 } }
);

export const CustomerHook = new ModelHook<ICustomer>(customerSchema);
export const CustomerModel: mongoose.Model<ICustomer> = MainConnection.model(
  "Customer",
  customerSchema
);

export const CustomerLoader = ModelLoader<ICustomer>(CustomerModel, CustomerHook);
