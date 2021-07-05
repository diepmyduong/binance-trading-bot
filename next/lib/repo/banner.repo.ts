import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";

export interface ShopBanner extends BaseModel {
  id: string;
  name: string;
  image: string;
  productId: string;
  isPublish: boolean;
  priority: number;
  product: Product;
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
