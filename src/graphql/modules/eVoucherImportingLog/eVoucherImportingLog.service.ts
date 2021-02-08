import { CrudService } from "../../../base/crudService";
import { EVoucherImportingLogModel } from "./eVoucherImportingLog.model";
class EVoucherImportingLogService extends CrudService<typeof EVoucherImportingLogModel> {
  constructor() {
    super(EVoucherImportingLogModel);
  }
}

const eVoucherImportingLogService = new EVoucherImportingLogService();

export { eVoucherImportingLogService };
