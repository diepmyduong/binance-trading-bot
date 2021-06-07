import axios from "axios";
import { GetAuthToken } from "../graphql/auth.link";
import { Category } from "./category.repo";
import { BaseModel, CrudRepository } from "./crud.repo";

export interface ProductParam {
  value: string;
  label: string;
}

export interface Product extends BaseModel {
  code: string;
  name: string;
  images: string[];
  youtubeLink: string;
  basePrice: number;
  shortDesc: string;
  description: string;
  params: ProductParam[];
  profitRate: number;
  unit: string;
  categoryId: string;
  categoryIds: string[];
  category: Category;
  categories: Category[];
}
export class ProductRepository extends CrudRepository<Product> {
  apiName: string = "Product";
  displayName: string = "sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    images: [String]
    code: String
    name: String
    basePrice: Int
    shortDesc: String
    profitRate: Int
    categoryId: ID
    category { id name profitRate parentProps }: Category
    unit: string;
    categoryIds: [ID]`);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    images: [String]
    youtubeLink: String
    basePrice: Int
    shortDesc: String
    description: String
    unit: string;
    params { value label }: [ProductParam]
    profitRate: Int
    categoryId: ID
    categoryIds: [ID]
    category { id name profitRate parentProps }: Category
    categories { id name code }: [Category]`);

  async copyProduct(productId: string, parentCategoryId: string): Promise<Product> {
    return await this.mutate({
      mutation: `copyProduct(productId: "${productId}", parentCategoryId: "${parentCategoryId}") {
          ${this.shortFragment}
        }`,
      clearStore: true,
    }).then((res) => {
      return res.data["g0"];
    });
  }

  async exportProduct(filter: any) {
    return axios
      .get("/api/product/export", {
        params: {
          filter: btoa(JSON.stringify(filter)),
        },
        responseType: "blob",
        headers: {
          "x-token": GetAuthToken(),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }

  async importProduct(file: File) {
    let formData = new FormData();
    formData.append("data", file);

    return axios
      .post("/api/product/import", formData, {
        headers: {
          "x-token": GetAuthToken(),
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      });
  }
}

export const ProductService = new ProductRepository();
