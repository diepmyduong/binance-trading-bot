import { CrudService } from "../../../base/crudService";
import { ProductLabelModel } from "./productLabel.model";
class ProductLabelService extends CrudService<typeof ProductLabelModel> {
  constructor() {
    super(ProductLabelModel);
  }
}

const productLabelService = new ProductLabelService();

export { productLabelService };
