import { BaseModel, CrudRepository } from "./crud.repo";
import { Product } from "./product.repo";

export interface Category extends BaseModel {
  name: string;
  code: string;
  isPrimary;
  productIds: string;
  priority: number;
  products: Product[];
}
export class CategoryRepository extends CrudRepository<Category> {
  apiName: string = "Category";
  displayName: string = "danh mục sản phẩm";
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
  products{
    id: String
    code: String
    name: String
    isPrimary: Boolean
    isCrossSale: Boolean
    type: String
    basePrice: Float
    subtitle:String
    intro:String
    image:String
    }: [Product]`);
  fullFragment: string = this.parseFragment(`
  id: String
  createdAt: DateTime
  updatedAt: DateTime
  memberId: ID
  name: String
  code: String
  isPrimary: Boolean
  productIds: [ID]
  priority: Int
  products{
    id: String
    code: String
    name: String
    isPrimary: Boolean
    isCrossSale: Boolean
    type: String
    basePrice: Float
    subtitle:String
    intro:String
    image:String
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
