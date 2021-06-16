import { CrudService } from "../../../base/crudService";
import { DriverModel } from "./driver.model";
class DriverService extends CrudService<typeof DriverModel> {
  constructor() {
    super(DriverModel);
  }
}

const driverService = new DriverService();

export { driverService };
