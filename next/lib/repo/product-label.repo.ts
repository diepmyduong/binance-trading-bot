import { BaseModel, CrudRepository } from "./crud.repo";

export interface ProductLabel extends BaseModel {
  memberId: string;
  name: string;
  color: string;
}
export class ProductLabelRepository extends CrudRepository<ProductLabel> {
  apiName: string = "ProductLabel";
  displayName: string = "nhãn sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    color: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    color: String
  `);
}

export const ProductLabelService = new ProductLabelRepository();
