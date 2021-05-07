import mongoose from "mongoose";
import { MainConnection } from "../../../loaders/database";
import { BaseDocument, ModelLoader, ModelHook } from "../../../base/baseModel";
const Schema = mongoose.Schema;
export enum ProductType {
  RETAIL = "RETAIL", // Sản phẩm bán lẻ
  SMS = "SMS", // Dịch vụ SMS
  SERVICE = "SERVICE", // Dịch vụ Khác
}
export type IProduct = BaseDocument & {
  code?: string; // Mã sản phẩm
  name?: string; // Tên sản phẩm
  isPrimary?: boolean; // Sản phẩm chính
  isCrossSale?: boolean; // Sản phẩm bán chéo
  crossSaleInventory?: number; // Tồn kho bán chéo
  crossSaleOrdered?: number; // Tồn kho bán chéo
  type?: ProductType; // Loại sản phẩm
  basePrice?: number; // Gía bán
  subtitle?: string; // Mô tả ngắn
  intro?: string; // Giới thiệu sản phẩm
  image?: string; // Hình ảnh đại diện
  commission0: number; // Hoa hồng Mobifone
  commission1: number; // Hoa hồng điểm bán
  commission2: number; // Hoa hồng giới thiệu
  commission3: number; // Hoa hồng kho
  baseCommission: number; // Hoa hồng CHO ĐIỂM BÁN
  enabledMemberBonus: boolean; // Thưởng cho điểm bán
  enabledCustomerBonus: boolean; // Thưởng cho khách hàng
  memberBonusFactor: number; // Hệ số thưởng điểm bán
  customerBonusFactor: number; // Hệ số thưởng khách hàng
  categoryId?: string; // Danh mục sản phẩm
  smsSyntax?: string; // Cú pháp SMS
  smsPhone?: string; // SMS tới số điện thoại
  priority: number; // độ ưu tiên
  allowSale?: boolean; // Mở bán
  memberId?: string; // Mã thành viên quản lý sản phẩm
  qty: number;

  width: number; // chiều rộng
  length: number; // chiều dài
  height: number; // chiều cao
  weight: number; // cân nặng

  viewCount: number;
};

const productSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    isCrossSale: { type: Boolean, default: false },
    crossSaleInventory: { type: Number, default: 0 },
    crossSaleOrdered: { type: Number, default: 0 },
    type: {
      type: String,
      enum: Object.values(ProductType),
      default: ProductType.RETAIL,
    },
    basePrice: { type: Number, default: 0 },
    subtitle: { type: String },
    intro: { type: String },
    image: { type: String },
    commission0: { type: Number, default: 0 }, // Hoa hồng cho Mobifone
    commission1: { type: Number, default: 0 }, // Hoa hồng cho điểm bán
    commission2: { type: Number, default: 0 }, // Hoa hồng cho giới thiệu
    commission3: { type: Number, default: 0 }, // Hoa hồng cho kho
    baseCommission: { type: Number, default: 0, min: 0 },
    enabledMemberBonus: { type: Boolean, default: false },
    enabledCustomerBonus: { type: Boolean, default: false },
    memberBonusFactor: { type: Number, default: 1 },
    customerBonusFactor: { type: Number, default: 1 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    smsSyntax: { type: String },
    smsPhone: { type: String },
    priority: { type: Number, default: 0 },
    allowSale: { type: Boolean, default: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
    // delivery
    width: { type: Number, default: 0 }, // chiều rộng
    length: { type: Number, default: 0 }, // chiều dài
    height: { type: Number, default: 0 }, // chiều cao
    weight: { type: Number, default: 1 }, // cân nặng

    viewCount: { type: Number, default: 0 }, //số lượng người xem

  },
  { timestamps: true }
);

productSchema.index({ memberId: 1 });
productSchema.index(
  { name: "text", code: "text" },
  { weights: { name: 2, code: 2 } }
);

export const ProductHook = new ModelHook<IProduct>(productSchema);
export const ProductModel: mongoose.Model<IProduct> = MainConnection.model(
  "Product",
  productSchema
);

export const ProductLoader = ModelLoader<IProduct>(ProductModel, ProductHook);