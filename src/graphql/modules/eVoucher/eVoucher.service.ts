import { CrudService } from "../../../base/crudService";
import { EVoucherModel } from "./eVoucher.model";
class EVoucherService extends CrudService<typeof EVoucherModel> {
  constructor() {
    super(EVoucherModel);
  }
}

const eVoucherService = new EVoucherService();

export { eVoucherService };
