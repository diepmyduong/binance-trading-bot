import { CrudService } from "../../../base/crudService";
import { MemberImportingLogModel } from "./memberImportingLog.model";
class MemberImportingLogService extends CrudService<typeof MemberImportingLogModel> {
  constructor() {
    super(MemberImportingLogModel);
  }
}

const memberImportingLogService = new MemberImportingLogService();

export { memberImportingLogService };
