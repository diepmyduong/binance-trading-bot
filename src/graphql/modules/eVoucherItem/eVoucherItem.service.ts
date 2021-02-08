import { CrudService } from "../../../base/crudService";
import { EVoucherItemModel } from "./eVoucherItem.model";
class EVoucherItemService extends CrudService<typeof EVoucherItemModel> {
  constructor() {
    super(EVoucherItemModel);
  }
}

const eVoucherItemService = new EVoucherItemService();

export { eVoucherItemService };
