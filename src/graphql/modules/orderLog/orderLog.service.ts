import { CrudService } from "../../../base/crudService";
import { OrderLogModel } from "./orderLog.model";
class OrderLogService extends CrudService<typeof OrderLogModel> {
  constructor() {
    super(OrderLogModel);
  }
}

const orderLogService = new OrderLogService();

export { orderLogService };
