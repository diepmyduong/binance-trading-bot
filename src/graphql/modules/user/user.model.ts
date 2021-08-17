import mongoose from "mongoose";
import { MainConnection } from "../../../helpers/mongo";
import { BaseDocument, ModelLoader } from "../../../base/model";
import { Place, PlaceSchema } from "../common/place.graphql";
const Schema = mongoose.Schema;
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}
export type IUser = BaseDocument & {
  uid?: string; // Mã UID Firebase
  email?: string; // Email
  name?: string; // Họ va tên
  role?: UserRole; // Vai trò
  phone?: string; // Điện thoại
  avatar?: string; // Ảnh đại diện
  place?: Place; // Vị trí
};

const userSchema = new Schema(
  {
    uid: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    role: { type: String, enum: Object.values(UserRole) },
    phone: { type: String },
    address: { type: String },
    avatar: { type: String },
    place: { type: PlaceSchema },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

userSchema.index({ uid: 1 });
userSchema.index({ name: "text" }, { weights: { name: 10 } } as any);

export const UserModel: mongoose.Model<IUser> = MainConnection.model("User", userSchema);

export const UserLoader = ModelLoader<IUser>(UserModel);
