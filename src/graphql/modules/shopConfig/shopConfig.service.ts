import { CrudService } from "../../../base/crudService";
import { ShopConfigModel } from "./shopConfig.model";
class ShopConfigService extends CrudService<typeof ShopConfigModel> {
  constructor() {
    super(ShopConfigModel);
  }
  getDefaultConfig() {
    return {
      shipPreparationTime: "30 phút",
      shipDefaultDistance: 2,
      shipDefaultFee: 15000,
      shipNextFee: 5000,
      shipOneKmFee: 0,
      shipUseOneKmFee: true,
      shipNote: "",
    };
  }
}

const shopConfigService = new ShopConfigService();

export { shopConfigService };
