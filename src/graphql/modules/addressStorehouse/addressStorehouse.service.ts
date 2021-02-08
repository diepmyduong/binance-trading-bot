import { CrudService } from "../../../base/crudService";
import { AddressStorehouseModel } from "./addressStorehouse.model";
class AddressStorehouseService extends CrudService<typeof AddressStorehouseModel> {
  constructor() {
    super(AddressStorehouseModel);
  }
}

const addressStorehouseService = new AddressStorehouseService();

export { addressStorehouseService };
