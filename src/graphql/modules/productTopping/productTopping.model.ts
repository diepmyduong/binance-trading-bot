import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
import { ToppingOption, ToppingOptionSchema } from "./types/toppingOption.schema";

const Schema = mongoose.Schema;

export type IProductTopping = BaseDocument & {
  memberId?: string; // Mã chủ shop
  name?: string; // Tên Topping
  required?: boolean; // Bắt buộc
  min?: number; // Số lượng chọn tối thiểu
  max?: number; // Số lượng chọn tối đa
  options?: ToppingOption[]; // Những lựa chọn
};

const productToppingSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    min: { type: Number, default: 0, min: 0 },
    max: { type: Number, default: 0, min: 0 },
    options: { type: [ToppingOptionSchema], default: [] },
  },
  { timestamps: true }
);

productToppingSchema.index({ name: "text" }, { weights: { name: 2 } });

export const ProductToppingHook = new ModelHook<IProductTopping>(productToppingSchema);
export const ProductToppingModel: mongoose.Model<IProductTopping> = MainConnection.model(
  "ProductTopping",
  productToppingSchema
);

export const ProductToppingLoader = ModelLoader<IProductTopping>(
  ProductToppingModel,
  ProductToppingHook
);
