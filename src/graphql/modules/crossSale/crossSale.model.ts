import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type ICrossSale = BaseDocument & {
  productId?: string; // Mã sản phẩm
  sellerId?: string; // Chủ shop đăng bán chéo
  productName?: string; // Tên sản phẩm
  allowSale?: boolean; // Cho phép bán
};

const crossSaleSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    productName: { type: String },
    allowSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

crossSaleSchema.index({ productName: "text" }, { weights: { productName: 2 } });

export const CrossSaleHook = new ModelHook<ICrossSale>(crossSaleSchema);
export const CrossSaleModel: mongoose.Model<ICrossSale> = MainConnection.model(
  "CrossSale",
  crossSaleSchema
);

export const CrossSaleLoader = ModelLoader<ICrossSale>(CrossSaleModel, CrossSaleHook);
