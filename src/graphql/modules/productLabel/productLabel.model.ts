import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IProductLabel = BaseDocument & {
  memberId?: string; // Mã chủ shop
  name?: string; // Tên nhãn
  color?: string; // Màu sắc
};

const productLabelSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#333333" },
  },
  { timestamps: true }
);

productLabelSchema.index({ memberId: 1, name: 1 }, { unique: true });
productLabelSchema.index({ name: "text" }, { weights: { name: 2 } });

export const ProductLabelHook = new ModelHook<IProductLabel>(productLabelSchema);
export const ProductLabelModel: mongoose.Model<IProductLabel> = MainConnection.model(
  "ProductLabel",
  productLabelSchema
);

export const ProductLabelLoader = ModelLoader<IProductLabel>(ProductLabelModel, ProductLabelHook);
