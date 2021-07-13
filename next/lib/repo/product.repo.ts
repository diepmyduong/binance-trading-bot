import axios from "axios";
import { GetAuthToken } from "../graphql/auth.link";
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
  categoryId: string;
  priority: number;
  allowSale: boolean;
  rating: number;
  saleRate: number;
  soldQty: number;
  labels: ProductLabel[];
  toppings: ProductTopping[];
  upsaleProductIds: string[];
  upsaleProducts: Product[];
}
export interface ProductLabel extends BaseModel {
  name: string;
  color: string;
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
    saleRate: Float
    subtitle: String
    image: String
    categoryId: ID
    rating: number
    soldQty: number
    labelIds: string[]
    labels {
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      memberId: ID
      name: String
      color: String
    }: [ProductLabel]
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
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    allowSale: Boolean
    basePrice: Float
    downPrice: Floa
    saleRate: Float
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
    labels {
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      memberId: ID
      name: String
      color: String
    }: [ProductLabel]
    upsaleProductIds: string[];
    upsaleProducts {
      id: String
      code: String
      name: String
    }: Product[];
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
