import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";
import { ShopVoucher } from "./shop-voucher.repo";

export interface ShopBanner extends BaseModel {
  image: string;
  title: string;
  subtitle: string;
  actionType: string;
  link: string;
  productId: string;
  voucherId: string;
  isPublic: boolean;
  product: Product;
  voucher: ShopVoucher;
}
export class ShopBannerRepository extends CrudRepository<ShopBanner> {
  apiName: string = "Shop";
  displayName: string = "shop";
  shortFragment: string = this.parseFragment(`
  id: String
  name: String
  image: String
  productId: ID
  isPublish: Boolean
  priority: Int
  product: Product`);
  fullFragment: string = this.parseFragment(`
  id: String
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  image: String
  productId: ID
  isPublish: Boolean
  priority: Int
  product: Product`);
}
export const ShopBannerService = new ShopBannerRepository();
