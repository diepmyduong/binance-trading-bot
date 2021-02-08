import { CrudService } from "../../../base/crudService";
import { DiligencePointsImportingLogModel } from "./diligencePointsImportingLog.model";
class DiligencePointsImportingLogService extends CrudService<typeof DiligencePointsImportingLogModel> {
  constructor() {
    super(DiligencePointsImportingLogModel);
  }
}

const diligencePointsImportingLogService = new DiligencePointsImportingLogService();

export { diligencePointsImportingLogService };
