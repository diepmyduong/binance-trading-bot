import { CrudService } from "../../../base/crudService";
import { StoreHouseCommissionLogModel } from "./storeHouseCommissionLog.model";
class StoreHouseCommissionLogService extends CrudService<typeof StoreHouseCommissionLogModel> {
  constructor() {
    super(StoreHouseCommissionLogModel);
  }
}

const storeHouseCommissionLogService = new StoreHouseCommissionLogService();

export { storeHouseCommissionLogService };
