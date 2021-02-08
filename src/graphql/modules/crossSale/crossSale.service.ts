import { CrudService } from "../../../base/crudService";
import { CrossSaleModel } from "./crossSale.model";
class CrossSaleService extends CrudService<typeof CrossSaleModel> {
  constructor() {
    super(CrossSaleModel);
  }
}

const crossSaleService = new CrossSaleService();

export { crossSaleService };
