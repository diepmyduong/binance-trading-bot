import { CrudService } from "../../../base/crudService";
import { PositionModel } from "./position.model";
class PositionService extends CrudService<typeof PositionModel> {
  constructor() {
    super(PositionModel);
  }
}

const positionService = new PositionService();

export { positionService };
