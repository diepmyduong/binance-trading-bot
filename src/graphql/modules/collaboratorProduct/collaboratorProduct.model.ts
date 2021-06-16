import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICollaboratorProduct = BaseDocument & {
  shortCode?: string;
  shortUrl?: string;
  clickCount?: number;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  collaboratorId?: string;
  memberId?: string;
  productId?: string;
  engagementCount?: number;
};

const collaboratorProductSchema = new Schema(
  {
    shortCode: { type: String },
    shortUrl: { type: String },
    clickCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    memberId: { type: Schema.Types.ObjectId, ref: "MemberId" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    engagementCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// collaboratorProductSchema.index({ name: "text" }, { weights: { name: 2 } });

export const CollaboratorProductHook = new ModelHook<ICollaboratorProduct>(
  collaboratorProductSchema
);
export const CollaboratorProductModel: mongoose.Model<ICollaboratorProduct> = MainConnection.model(
  "CollaboratorProduct",
  collaboratorProductSchema
);

export const CollaboratorProductLoader = ModelLoader<ICollaboratorProduct>(
  CollaboratorProductModel,
  CollaboratorProductHook
);
