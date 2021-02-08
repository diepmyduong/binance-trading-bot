import { CrudService } from "../../../base/crudService";
import { OrderItemModel } from "./orderItem.model";
class OrderItemService extends CrudService<typeof OrderItemModel> {
  constructor() {
    super(OrderItemModel);
  }
}

const orderItemService = new OrderItemService();

export { orderItemService };
