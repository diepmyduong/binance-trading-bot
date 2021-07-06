import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";
import { ShopVoucher } from "./shop-voucher.repo";

export interface ShopConfig extends BaseModel {
  memberId: string;
  vnpostCode: string;
  vnpostPhone: string;
  vnpostName: string;
  shipPreparationTime: string;
  shipDefaultDistance: number;
  shipDefaultFee: number;
  shipNextFee: number;
  shipOneKmFee: number;
  shipUseOneKmFee: boolean;
  shipNote: string;
  rating: number;
  ratingQty: number;
  soldQty: number;
  banners: ShopBanner[];
  productGroups: ShopProductGroup[];
  tags: ShopTag[];
}

export interface ShopTag {
  name: string;
  icon: string;
  qty: number;
}

export interface ShopProductGroup {
  name: string;
  isPublic: boolean;
  productIds: string[];
  products: Product[];
}

export interface ShopBanner {
  image: string;
  title: string;
  subtitle: string;
  actionType: "WEBSITE" | "PRODUCT" | "VOUCHER";
  link: string;
  productId: string;
  voucherId: string;
  isPublic: boolean;
  product: Product;
  voucher: ShopVoucher;
}

export class ShopConfigRepository extends CrudRepository<ShopConfig> {
  apiName: string = "ShopConfig";
  displayName: string = "cấu hình cửa hàng";
  shortFragment: string = this.parseFragment(`
    id: String 
    createdAt: DateTime
    updatedAt: DateTime`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    vnpostCode: String
    vnpostPhone: String
    vnpostName: String
    shipPreparationTime: String
    shipDefaultDistance: Int
    shipDefaultFee: Float
    shipNextFee: Float
    shipOneKmFee: Float
    shipUseOneKmFee: Boolean
    shipNote: String
    rating: Float
    ratingQty: Int
    soldQty: Int
    banners {
      image: String
      title: String
      subtitle: String
      actionType: String
      link: String
      productId: ID
      voucherId: ID
      isPublic: Boolean
      product {
        id: String
        code: String
        name: String
      }: Product
      voucher {
        id: String
        code: String
      }: ShopVoucher
    }: [ShopBanner]
    productGroups {
      name: String
      isPublic: Boolean
      productIds: [ID]
      products {
        id: String
        code: String
        name: String
        basePrice: Float
        downPrice: Float
        saleRate: Int
        subtitle: String
        image: String
        rating: Float
        soldQty: Int
        labelIds: [ID]
        labels {
          id: String
          name: String
          color: String
        }: [ProductLabel]
      }: [Product]
    }: [ShopProductGroup]
    tags { 
      name: String
      icon: String
      qty: Int 
    }: [ShopTag]`);

  getShopConfig(): Promise<ShopConfig> {
    return this.query({
      query: `getShopConfig {
          ${this.fullFragment}
        }`,
    })
      .then((res) => res.data.g0)
      .catch((err) => {
        throw err;
      });
  }
}
export const ShopConfigService = new ShopConfigRepository();

export const SHOP_BANNER_ACTIONS: Option[] = [
  { value: "PRODUCT", label: "Món" },
  { value: "VOUCHER", label: "Voucher" },
  { value: "WEBSITE", label: "Trang web" },
];
