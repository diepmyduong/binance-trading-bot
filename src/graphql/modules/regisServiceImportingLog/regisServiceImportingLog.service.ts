import { CrudService } from "../../../base/crudService";
import { RegisServiceImportingLogModel } from "./regisServiceImportingLog.model";
class RegisServiceImportingLogService extends CrudService<typeof RegisServiceImportingLogModel> {
  constructor() {
    super(RegisServiceImportingLogModel);
  }
}

const regisServiceImportingLogService = new RegisServiceImportingLogService();

export { regisServiceImportingLogService };
