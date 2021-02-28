import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;

export type IProductImportingLog = BaseDocument & {
  no: string; // STT
  code: string; // Mã sản phẩm
  name: string; // Tên sản phẩm
  desc: string; // Mô tả	Loại sản phẩm
  type: string; // Loại sản phẩm
  category: string; // Danh mục
  image: string; // Hình ảnh (đường link)
  price: string; // Giá tiền
  productLength: string; // Chiều dài (cm)
  productWidth: string; // Chiều rộng (cm)
  productHeight: string; // Chiều cao (cm)
  productWeight: string; // Khối lượng (gr)
  commission1: string; // Hoa hồng cho người bán trực tiếp
  commission2: string; // Hoa hồng cho người giới thiệu
  line: Number;
  success: Boolean;
  error: string;
};

const productImportingLogSchema = new Schema(
  {
    no: { type: String },
    code: { type: String },
    name: { type: String },
    desc: { type: String }, // Mô tả	Loại sản phẩm
    type: { type: String }, // Loại sản phẩm
    category: { type: String }, // Danh mục
    image: { type: String }, // Hình ảnh (đường link)
    price: { type: String }, // Giá tiền
    productLength: { type: String }, // Chiều dài (cm)
    productWidth: { type: String }, // Chiều rộng (cm)
    productHeight: { type: String }, // Chiều cao (cm)
    productWeight: { type: String }, // Khối lượng (gr)
    commission1: { type: String }, // Hoa hồng cho người bán trực tiếp
    commission2: { type: String }, // Hoa hồng cho người giới thiệu
    line: { type: Number },
    success: { type: Boolean },
    error: { type: String },
  },
  { timestamps: true }
);

// productImportingLogSchema.index({ name: "text" }, { weights: { name: 2 } });

export const ProductImportingLogHook = new ModelHook<IProductImportingLog>(
  productImportingLogSchema
);
export const ProductImportingLogModel: mongoose.Model<IProductImportingLog> = MainConnection.model(
  "ProductImportingLog",
  productImportingLogSchema
);

export const ProductImportingLogLoader = ModelLoader<IProductImportingLog>(
  ProductImportingLogModel,
  ProductImportingLogHook
);
