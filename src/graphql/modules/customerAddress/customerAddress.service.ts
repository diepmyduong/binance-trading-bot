import { CrudService } from "../../../base/crudService";
import { CustomerAddressModel } from "./customerAddress.model";
class CustomerAddressService extends CrudService<typeof CustomerAddressModel> {
  constructor() {
    super(CustomerAddressModel);
  }
}

const customerAddressService = new CustomerAddressService();

export { customerAddressService };
