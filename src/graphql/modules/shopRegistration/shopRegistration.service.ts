import { CrudService } from "../../../base/crudService";
import { ShopRegistrationModel } from "./shopRegistration.model";
class ShopRegistrationService extends CrudService<typeof ShopRegistrationModel> {
  constructor() {
    super(ShopRegistrationModel);
  }
}

const shopRegistrationService = new ShopRegistrationService();

export { shopRegistrationService };
