import { CrudService } from "../../../base/crudService";
import { CustomerVoucherModel } from "./customerVoucher.model";
class CustomerVoucherService extends CrudService<typeof CustomerVoucherModel> {
  constructor() {
    super(CustomerVoucherModel);
  }
}

const customerVoucherService = new CustomerVoucherService();

export { customerVoucherService };
