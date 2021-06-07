import { BaseModel, CrudRepository } from "./crud.repo";

export interface Category extends BaseModel {
  name: string;
  code: string;
  agency: boolean;
  parentIds: string[];
  subCategoryIds: string[];
  profitRate: number;
  properties: string[];
  parentProps: string[];
  parents: Category[];
  subCategories: Category[];
}
export class CategoryRepository extends CrudRepository<Category> {
  apiName: string = "Category";
  displayName: string = "danh mục sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    parentIds: [String]
    subCategoryIds: [String]`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    agency: Boolean
    parentIds: [String]
    subCategoryIds: [String]
    profitRate: Float
    properties: [String]
    parentProps: [String]
    parents { id name }: [Category]
    subCategories { id name }: [Category]`);

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
