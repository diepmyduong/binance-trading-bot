import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IShopConfig = BaseDocument & {
  memberId?: string; // Mã chủ shop
  vnpostToken?: string; // Token vnpost
  vnpostCode?: string; // Mã CRM VNPost
  vnpostPhone?: string; // Điện thoại VNPost
  vnpostName?: string; // Tên người dùng VNPost
};

const shopConfigSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    vnpostToken: { type: String },
    vnpostCode: { type: String },
    vnpostPhone: { type: String },
    vnpostName: { type: String },
  },
  { timestamps: true }
);

shopConfigSchema.index({ memberId: 1 }, { unique: true });
// shopConfigSchema.index({ name: "text" }, { weights: { name: 2 } });

export const ShopConfigHook = new ModelHook<IShopConfig>(shopConfigSchema);
export const ShopConfigModel: mongoose.Model<IShopConfig> = MainConnection.model(
  "ShopConfig",
  shopConfigSchema
);

export const ShopConfigLoader = ModelLoader<IShopConfig>(ShopConfigModel, ShopConfigHook);
