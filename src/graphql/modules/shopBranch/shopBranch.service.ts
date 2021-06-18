import { CrudService } from "../../../base/crudService";
import { ShopBranchModel } from "./shopBranch.model";
class ShopBranchService extends CrudService<typeof ShopBranchModel> {
  constructor() {
    super(ShopBranchModel);
  }
}

const shopBranchService = new ShopBranchService();

export { shopBranchService };
