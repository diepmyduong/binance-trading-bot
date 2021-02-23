import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gender } from "../member/member.model";
const Schema = mongoose.Schema;

export type ICollaborator = BaseDocument & {
  code?: string; // Mã cộng tác viên
  name?: string; // Tên khách hàng
  phone?: string; // Số điện thoại
  gender?: Gender; // Giới tính
  birthday?: Date; // Ngày sinh
  address?: string; // Địa chỉ
  province?: string; // Tỉnh / thành
  district?: string; // Quận / huyện
  ward?: string; // Phường / xã
  provinceId?: string; // Mã Tỉnh / thành
  districtId?: string; // Mã Quận / huyện
  wardId?: string; // Mã Phường / xã
  commissionPoint?: number; // Hoa hồng cộng tác viên
};

const collaboratorSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: Object.values(Gender), default: Gender.OTHER },
    birthday: { type: Date },
    address: { type: String },
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    provinceId: { type: String },
    districtId: { type: String },
    wardId: { type: String },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    commissionPoint: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// collaboratorSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CollaboratorHook = new ModelHook<ICollaborator>(collaboratorSchema);
export const CollaboratorModel: mongoose.Model<ICollaborator> = MainConnection.model(
  "Collaborator",
  collaboratorSchema
);

export const CollaboratorLoader = ModelLoader<ICollaborator>(CollaboratorModel, CollaboratorHook);
