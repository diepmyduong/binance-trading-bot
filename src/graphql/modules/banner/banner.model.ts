import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IBanner = BaseDocument & {
  name?: string; // Tên banner
  image?: string; // Hình ảnh
  productId?: string; // Mã sản phẩm
  isPublish?: boolean; // Kích hoạt
  priority?: number; // Ưu tiên
};

const bannerSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    isPublish: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bannerSchema.index({ name: "text" }, { weights: { name: 2 } });

export const BannerHook = new ModelHook<IBanner>(bannerSchema);
export const BannerModel: mongoose.Model<IBanner> = MainConnection.model("Banner", bannerSchema);

export const BannerLoader = ModelLoader<IBanner>(BannerModel, BannerHook);
