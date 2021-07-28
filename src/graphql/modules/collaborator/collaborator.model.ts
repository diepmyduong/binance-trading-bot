import mongoose from "mongoose";

import { BaseDocument, ModelHook, ModelLoader } from "../../../base/baseModel";
import { MainConnection } from "../../../loaders/database";

const Schema = mongoose.Schema;

export enum CollaboratorStatus {
  PENDING = "PENDING", // Đang chừo duyệt
  ACTIVE = "ACTIVE", // Đã kích hoạt
  BLOCKED = "BLOCKED", // Đã khoá
}

export type ICollaborator = BaseDocument & {
  code?: string; // mã cộng tác viên
  name?: string; // Tên cộng tác viên
  phone?: string; // Số điện thoại
  memberId?: string; // Chủ shop
  customerId?: string; // khách hàng
  shortCode?: string; // Mã giới thiệu
  shortUrl?: string; // Đường dẫn giới thiệu
  clickCount?: number; // Lượt click
  likeCount?: number; // Lượt like
  shareCount?: number; // Lượt share
  commentCount?: number; // Lượt comment
  engagementCount?: number; // Lượt tương tác
  status?: CollaboratorStatus; // Trạng thái
};

const collaboratorSchema = new Schema(
  {
    code: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    clickCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    shortCode: { type: String },
    shortUrl: { type: String },
    engagementCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(CollaboratorStatus),
      default: CollaboratorStatus.PENDING,
    },
  },
  { timestamps: true }
);

collaboratorSchema.index(
  {
    name: "text",
    phone: "text",
  },
  {
    weights: {
      name: 2,
      phone: 1,
    },
  }
);
collaboratorSchema.index({ memberId: 1 });
collaboratorSchema.index({ memberId: 1, phone: 1 }, { unique: true });
collaboratorSchema.index({ customerId: 1 });

export const CollaboratorHook = new ModelHook<ICollaborator>(collaboratorSchema);
export const CollaboratorModel: mongoose.Model<ICollaborator> = MainConnection.model(
  "Collaborator",
  collaboratorSchema
);

export const CollaboratorLoader = ModelLoader<ICollaborator>(CollaboratorModel, CollaboratorHook);
