import { CrudService } from "../../../base/crudService";
import { CounterModel } from "../../../services/counter/counter.model";
class CounterService extends CrudService {
  initedCodes: string[] = [];
  constructor() {
    super(CounterModel);
  }
  async trigger(name: string, initValue: number = 10000, step = 1) {
    if (!this.initedCodes.includes(name)) {
      await CounterModel.updateOne(
        { name },
        { $setOnInsert: { value: initValue } },
        { upsert: true }
      );
      this.initedCodes.push(name);
    }
    return await CounterModel.findOneAndUpdate(
      { name },
      { $inc: { value: step } },
      { new: true }
    ).then((res) => res.value);
  }
}

const counterService = new CounterService();

export { counterService };
