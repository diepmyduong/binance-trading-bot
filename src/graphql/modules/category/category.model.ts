import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICategory = BaseDocument & {
  name?: string; // Tên danh mục
  code?: string; // Mã danh mục
  isPrimary?: boolean; // Danh mục sản phẩm chính
  memberId?: string; // Mã thành viên quản lý danh mục
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    isPrimary: { type: Boolean, default: false },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  { timestamps: true }
);
categorySchema.index({ memberId: 1 });
categorySchema.index({ name: "text" }, { weights: { name: 2 } });

export const CategoryHook = new ModelHook<ICategory>(categorySchema);
export const CategoryModel: mongoose.Model<ICategory> = MainConnection.model(
  "Category",
  categorySchema
);

export const CategoryLoader = ModelLoader<ICategory>(CategoryModel, CategoryHook);
