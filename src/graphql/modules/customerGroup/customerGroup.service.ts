import { CrudService } from "../../../base/crudService";
import { CustomerGroupModel } from "./customerGroup.model";
class CustomerGroupService extends CrudService<typeof CustomerGroupModel> {
  constructor() {
    super(CustomerGroupModel);
  }
}

const customerGroupService = new CustomerGroupService();

export { customerGroupService };
