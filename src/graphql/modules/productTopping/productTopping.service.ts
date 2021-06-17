import { CrudService } from "../../../base/crudService";
import { ProductToppingModel } from "./productTopping.model";
class ProductToppingService extends CrudService<typeof ProductToppingModel> {
  constructor() {
    super(ProductToppingModel);
  }
}

const productToppingService = new ProductToppingService();

export { productToppingService };
