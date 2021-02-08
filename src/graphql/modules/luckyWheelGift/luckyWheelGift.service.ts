import { CrudService } from "../../../base/crudService";
import { LuckyWheelGiftModel } from "./luckyWheelGift.model";
class LuckyWheelGiftService extends CrudService<typeof LuckyWheelGiftModel> {
  constructor() {
    super(LuckyWheelGiftModel);
  }
}

const luckyWheelGiftService = new LuckyWheelGiftService();

export { luckyWheelGiftService };
