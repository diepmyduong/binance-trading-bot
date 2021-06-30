import { BaseModel, CrudRepository } from "./crud.repo";

export interface ProductTopping extends BaseModel {
  memberId: string;
  name: string;
  required: boolean;
  min: number;
  max: number;
  options: ToppingOption[];
}
export interface ToppingOption {
  name: string;
  price: number;
  isDefault: boolean;
}
export class ProductToppingRepository extends CrudRepository<ProductTopping> {
  apiName: string = "ProductTopping";
  displayName: string = "mẫu topping";
  shortFragment: string = this.parseFragment(`
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
  `);
  fullFragment: string = this.parseFragment(`
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
  `);
}

export const ProductToppingService = new ProductToppingRepository();
