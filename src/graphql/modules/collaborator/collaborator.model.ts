import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gender } from "../member/member.model";
const Schema = mongoose.Schema;

export type ICollaborator = BaseDocument & {
  code?: string; // mã cộng tác viên
  name?: string; // Tên cộng tác viên
  phone?: string; // Số điện thoại
  memberId: string; // Chủ shop
  customerId: string; // khách hàng
};

const collaboratorSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    customerId : { type: Schema.Types.ObjectId, ref: "Customer" },
  },
  { timestamps: true }
);

// collaboratorSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CollaboratorHook = new ModelHook<ICollaborator>(
  collaboratorSchema
);
export const CollaboratorModel: mongoose.Model<ICollaborator> = MainConnection.model(
  "Collaborator",
  collaboratorSchema
);

export const CollaboratorLoader = ModelLoader<ICollaborator>(
  CollaboratorModel,
  CollaboratorHook
);
