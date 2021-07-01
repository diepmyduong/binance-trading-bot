import { BaseModel, CrudRepository } from "./crud.repo";
import { Product, ProductService } from "./product.repo";

export interface Category extends BaseModel {
  memberId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  productIds: string[];
  priority: number;
  products: Product[];
}
export class CategoryRepository extends CrudRepository<Category> {
  apiName: string = "Category";
  displayName: string = "danh mục";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    code: String
    isPrimary: Boolean
    productIds: [ID]
    priority: Int
    products {
      id: String
      code: String
      name: String
      allowSale: Boolean
      basePrice: Float
      downPrice: Float
      subtitle:String
      image:String
      downPrice:Float
      rating:Float
      saleRate:Float
      soldQty:int
      labels{id name color}	: [ProductLabel]
      }: [Product]`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    code: String
    isPrimary: Boolean
    isCrossSale: Boolean
    type: String
    basePrice: Float
    subtitle:String
    intro:String
    image:String
    downPrice:Float
    rating:Float
    saleRate:Float
    soldQty:int
  labels{id name color}	: [ProductLabel]
    }: [Product]`);

  async copyCategory(categoryId: string, parentCategoryId: string): Promise<Category> {
    return await this.mutate({
      mutation: `copyCategory(categoryId: "${categoryId}", parentCategoryId: "${parentCategoryId}") {
          ${this.shortFragment}
        }`,
      clearStore: true,
    }).then((res) => {
      return res.data["g0"];
    });
  }
}

export const CategoryService = new CategoryRepository();
