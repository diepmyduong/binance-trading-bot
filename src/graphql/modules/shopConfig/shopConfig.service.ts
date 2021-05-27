import { CrudService } from "../../../base/crudService";
import { ShopConfigModel } from "./shopConfig.model";
class ShopConfigService extends CrudService<typeof ShopConfigModel> {
  constructor() {
    super(ShopConfigModel);
  }
}

const shopConfigService = new ShopConfigService();

export { shopConfigService };
