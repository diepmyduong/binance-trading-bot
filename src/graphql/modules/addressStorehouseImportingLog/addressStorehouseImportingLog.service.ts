import { CrudService } from "../../../base/crudService";
import { AddressStorehouseImportingLogModel } from "./addressStorehouseImportingLog.model";
class AddressStorehouseImportingLogService extends CrudService<typeof AddressStorehouseImportingLogModel> {
  constructor() {
    super(AddressStorehouseImportingLogModel);
  }
}

const addressStorehouseImportingLogService = new AddressStorehouseImportingLogService();

export { addressStorehouseImportingLogService };
