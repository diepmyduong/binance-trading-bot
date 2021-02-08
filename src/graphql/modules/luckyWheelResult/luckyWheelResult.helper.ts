import { CounterModel } from "../counter/counter.model";
import { counterService } from "../counter/counter.service";
import moment from 'moment';
import { ILuckyWheelResult } from "./luckyWheelResult.model";
export class LuckyWheelResultHelper {
  constructor(public luckyWheelResult: ILuckyWheelResult) { }
  static async generateCode() {
    return await counterService.trigger("luckyWheelResult").then((count) => "LWR" + count);
  }
}
