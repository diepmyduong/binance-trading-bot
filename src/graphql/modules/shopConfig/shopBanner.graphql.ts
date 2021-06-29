import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ProductLoader } from "../product/product.model";
import { ShopVoucherLoader } from "../shopVoucher/shopVoucher.model";

export enum BannerActionType {
  WEBSITE = "WEBSITE", // Mở 1 đường dẫn
  PRODUCT = "PRODUCT", // Mở 1 sản phẩm
  VOUCHER = "VOUCHER", // Mở 1 voucher
}
export type ShopBanner = {
  image?: string; // Hình ảnh
  title?: string; // Tiêu đề
  subtitle?: string; // Mô tả tiêu đề
  actionType?: BannerActionType; // Loại hành động
  link?: string; // Đường dẫn website
  productId?: string; // Mã sản phẩm
  voucherId?: string; // Mã voucher
  isPublic?: boolean; // Hiển thị công khai
};
export const ShopBannerSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  actionType: { type: String, enum: Object.values(BannerActionType), required: true },
  link: { type: String },
  productId: { type: String },
  voucherId: { type: String },
  isPublic: { type: Boolean, default: false },
});
export default {
  schema: gql`
    type  ShopBanner {
      "Hình ảnh"
      image: String
      "Tiêu đề"
      title: String
      "Mô tả tiêu đề"
      subtitle: String
      "Loại hành động ${Object.values(BannerActionType)}"
      actionType: String
      "Đường dẫn website"
      link: String
      "Mã sản phẩm"
      productId: ID
      "Mã voucher"
      voucherId: ID
      "Hiển thị công khai"
      isPublic: Boolean

      product: Product
      voucher: ShopVoucher
    }
    input ShopBannerInput {
      "Hình ảnh"
      image: String!
      "Tiêu đề"
      title: String
      "Mô tả tiêu đề"
      subtitle: String
      "Loại hành động ${Object.values(BannerActionType)}"
      actionType: String!
      "Đường dẫn website"
      link: String
      "Mã sản phẩm"
      productId: ID
      "Mã voucher"
      voucherId: ID
      "Hiển thị công khai"
      isPublic: Boolean
    }
    extend type ShopConfig {
      banners: [ShopBanner]
    }
    extend input UpdateShopConfigInput {
      banners: [ShopBannerInput]
    }
  `,
  resolver: {
    ShopBanner: {
      product: GraphQLHelper.loadById(ProductLoader, "productId"),
      voucher: GraphQLHelper.loadById(ShopVoucherLoader, "voucherId"),
    },
  },
};
