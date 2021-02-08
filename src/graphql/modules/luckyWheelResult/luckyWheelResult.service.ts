import { CrudService } from "../../../base/crudService";
import { LuckyWheelResultModel } from "./luckyWheelResult.model";
class LuckyWheelResultService extends CrudService<typeof LuckyWheelResultModel> {
  constructor() {
    super(LuckyWheelResultModel);
  }
}

const luckyWheelResultService = new LuckyWheelResultService();

export { luckyWheelResultService };
