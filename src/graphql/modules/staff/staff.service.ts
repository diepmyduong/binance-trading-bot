import { CrudService } from "../../../base/crudService";
import { StaffModel, StaffScope } from "./staff.model";
class StaffService extends CrudService<typeof StaffModel> {
  constructor() {
    super(StaffModel);
  }
  async getStaffByBranchAndScope(memberId: string, branchId: string) {
    return await StaffModel.find({ memberId }).then((res) =>
      res.filter(
        (staff) =>
          staff.scopes.includes(StaffScope.MANAGER) ||
          staff.branchId.toString() == branchId.toString()
      )
    );
  }
}

const staffService = new StaffService();

export { staffService };
