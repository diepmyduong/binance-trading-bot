import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICategory = BaseDocument & {
  memberId?: string; // Mã thành viên quản lý danh mục
  name?: string; // Tên danh mục
  code?: string; // Mã danh mục
  isPrimary?: boolean; // Danh mục sản phẩm chính
  productIds?: string[]; // Mã sản phẩm
  priority?: number; // Độ ưu tiên
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    isPrimary: { type: Boolean, default: false },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    productIds: { type: [{ type: Schema.Types.ObjectId, ref: "Product" }], default: [] },
    priority: { type: Number, default: 1 },
  },
  { timestamps: true }
);
categorySchema.index({ memberId: 1, code: 1 }, { unique: true });
categorySchema.index({ name: "text", code: "text" }, { weights: { name: 2, code: 2 } });

export const CategoryHook = new ModelHook<ICategory>(categorySchema);
export const CategoryModel: mongoose.Model<ICategory> = MainConnection.model(
  "Category",
  categorySchema
);

export const CategoryLoader = ModelLoader<ICategory>(CategoryModel, CategoryHook);
