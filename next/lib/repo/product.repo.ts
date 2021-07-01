import axios from "axios";
import { GetAuthToken } from "../graphql/auth.link";
import { Category } from "./category.repo";
import { BaseModel, CrudRepository } from "./crud.repo";
import { ProductTopping } from "./product-topping.repo";

export interface ProductParam {
  value: string;
  label: string;
}

export interface Product extends BaseModel {
  id: string;
  code: string;
  name: string;
  isPrimary: boolean;
  type: string;
  basePrice: number;
  downPrice: number;
  subtitle?: string;
  image: string;
  categoryId?: string;
  priority?: number;
  allowSale?: boolean;
  toppings: ProductTopping[];
  rating: number;
  soldQty: number;
  labelIds: string[];
}
export class ProductRepository extends CrudRepository<Product> {
  apiName: string = "Product";
  displayName: string = "sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    allowSale: Boolean
    basePrice: Float
    downPrice: Float
    subtitle: String
    image: String
    categoryId: ID
    rating: number
    soldQty: number
    labelIds: string[]
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    allowSale: Boolean
    basePrice: Float
    downPrice: Floa
    subtitle: String
    image: String
    categoryId: ID
    rating: number
    soldQty: number
    labelIds: string[]
    toppings {
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      memberId: ID
      name: String
      required: Boolean
      min: Int
      max: Int
      options {
        name: String
        price: Float
        isDefault: Boolean
      }: [ToppingOption]
    }: [ProductTopping]
  `);

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
