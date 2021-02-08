import { CrudService } from "../../../base/crudService";
import { BranchModel } from "./branch.model";
class BranchService extends CrudService<typeof BranchModel> {
  constructor() {
    super(BranchModel);
  }
}

const branchService = new BranchService();

export { branchService };
