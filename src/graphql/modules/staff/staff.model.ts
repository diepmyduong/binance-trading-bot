import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IStaff = BaseDocument & {
  memberId?: string; // Mã chủ shop
  username?: string; // Tên đăng nhập
  password?: string; // Mật khẩu
  name?: string; // Tên nhân viên
  phone?: string; // Điện thoại nhân viên
  avatar?: string; // Ảnh đại diện
  address?: string; // Địa chỉ liên hệ
  branchId?: string; // Mã chi nhánh
};

const staffSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    address: { type: String },
    branchId: { type: Schema.Types.ObjectId, ref: "ShopBranch", required: true },
  },
  { timestamps: true }
);

staffSchema.index({ memberId: 1, username: 1 });
staffSchema.index(
  { username: "text", name: "text", phone: "text" },
  { weights: { username: 2, name: 2, phone: 2 } }
);

export const StaffHook = new ModelHook<IStaff>(staffSchema);
export const StaffModel: mongoose.Model<IStaff> = MainConnection.model("Staff", staffSchema);

export const StaffLoader = ModelLoader<IStaff>(StaffModel, StaffHook);
