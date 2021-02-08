import { CrudService } from "../../../base/crudService";
import { RegisSMSImportingLogModel } from "./regisSMSImportingLog.model";
class RegisSMSImportingLogService extends CrudService<typeof RegisSMSImportingLogModel> {
  constructor() {
    super(RegisSMSImportingLogModel);
  }
}

const regisSMSImportingLogService = new RegisSMSImportingLogService();

export { regisSMSImportingLogService };
