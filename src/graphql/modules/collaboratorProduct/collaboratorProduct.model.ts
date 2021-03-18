import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICollaboratorProduct = BaseDocument & {
  shortCode?: string;
  shortUrl?: string;
  likeCount?: number;
  shareCount?: number;
  commentCount?: string;
  collaboratorId?: string;
  productId?: string;
};

const collaboratorProductSchema = new Schema(
  {
    shortCode: { type: String },
    shortUrl: { type: String },
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
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
