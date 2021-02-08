import { CrudService } from "../../../base/crudService";
import { DeliveryLogModel } from "./deliveryLog.model";
class DeliveryLogService extends CrudService<typeof DeliveryLogModel> {
  constructor() {
    super(DeliveryLogModel);
  }
}

const deliveryLogService = new DeliveryLogService();

export { deliveryLogService };
