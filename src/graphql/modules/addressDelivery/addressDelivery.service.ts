import { CrudService } from "../../../base/crudService";
import { AddressDeliveryModel } from "./addressDelivery.model";
class AddressDeliveryService extends CrudService<typeof AddressDeliveryModel> {
  constructor() {
    super(AddressDeliveryModel);
  }
}

const addressDeliveryService = new AddressDeliveryService();

export { addressDeliveryService };
