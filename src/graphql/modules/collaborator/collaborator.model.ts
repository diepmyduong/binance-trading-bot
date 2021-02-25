import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { Gender } from "../member/member.model";
const Schema = mongoose.Schema;

export type ICollaborator = BaseDocument & {
  name?: string; // Tên khách hàng
  phone?: string; // Số điện thoại
  customerId: string; // Khách hàng
  memberId: string; // Chủ shop
};

const collaboratorSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
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
