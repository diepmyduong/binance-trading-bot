import { CrudService } from "../../../base/crudService";
import { AddressDeliveryImportingLogModel } from "./addressDeliveryImportingLog.model";
class AddressDeliveryImportingLogService extends CrudService<typeof AddressDeliveryImportingLogModel> {
  constructor() {
    super(AddressDeliveryImportingLogModel);
  }
}

const addressDeliveryImportingLogService = new AddressDeliveryImportingLogService();

export { addressDeliveryImportingLogService };
