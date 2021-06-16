import { CrudService } from "../../../base/crudService";
import { StaffModel } from "./staff.model";
class StaffService extends CrudService<typeof StaffModel> {
  constructor() {
    super(StaffModel);
  }
}

const staffService = new StaffService();

export { staffService };
