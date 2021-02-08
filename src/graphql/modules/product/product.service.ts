import { CrudService } from "../../../base/crudService";
import { ProductModel } from "./product.model";
class ProductService extends CrudService<typeof ProductModel> {
  constructor() {
    super(ProductModel);
  }
}

const productService = new ProductService();

export { productService };
