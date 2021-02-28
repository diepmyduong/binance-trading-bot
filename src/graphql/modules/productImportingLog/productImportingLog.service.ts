import { CrudService } from "../../../base/crudService";
import { ProductImportingLogModel } from "./productImportingLog.model";
class ProductImportingLogService extends CrudService<typeof ProductImportingLogModel> {
  constructor() {
    super(ProductImportingLogModel);
  }
}

const productImportingLogService = new ProductImportingLogService();

export { productImportingLogService };
