import { CrudService } from "../../../base/crudService";
import { CustomerCommissionLogModel } from "./customerCommissionLog.model";
class CustomerCommissionLogService extends CrudService<typeof CustomerCommissionLogModel> {
  constructor() {
    super(CustomerCommissionLogModel);
  }
}

const customerCommissionLogService = new CustomerCommissionLogService();

export { customerCommissionLogService };
