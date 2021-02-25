import { CrudService } from "../../../base/crudService";
import { CollaboratorImportingLogModel } from "./collaboratorImportingLog.model";
class CollaboratorImportingLogService extends CrudService<typeof CollaboratorImportingLogModel> {
  constructor() {
    super(CollaboratorImportingLogModel);
  }
}

const collaboratorImportingLogService = new CollaboratorImportingLogService();

export { collaboratorImportingLogService };
