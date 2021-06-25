import { CrudService } from "../../../base/crudService";
import { ShopVoucherModel } from "./shopVoucher.model";
class ShopVoucherService extends CrudService<typeof ShopVoucherModel> {
  constructor() {
    super(ShopVoucherModel);
  }
}

const shopVoucherService = new ShopVoucherService();

export { shopVoucherService };
