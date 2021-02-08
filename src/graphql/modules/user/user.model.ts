import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}
export type IUser = BaseDocument & {
  uid?: string;
  email?: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  province?: string;
  district?: string;
  ward?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  psid?: string; // Mã PSID fanpage chính
  facebookAccessToken?: string
};

const userSchema = new Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: Object.values(UserRole) },
    phone: { type: String },
    address: { type: String },
    avatar: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    psid: { type: String },
    facebookAccessToken: { type: String },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

userSchema.index({ uid: 1 }, { unique: true });
userSchema.index({ name: "text" }, { weights: { name: 10 } });

export const UserHook = new ModelHook<IUser>(userSchema);
export const UserModel: mongoose.Model<IUser> = MainConnection.model("User", userSchema);

export const UserLoader = ModelLoader<IUser>(UserModel, UserHook);
