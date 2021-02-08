import { CounterModel } from "../counter/counter.model";
import { counterService } from "../counter/counter.service";
import { ILuckyWheel } from "./luckyWheel.model";
import moment from 'moment';
export class LuckyWheelHelper {
  constructor(public luckyWheel: ILuckyWheel) { }
  static async generateCode() {
    return await counterService.trigger("luckyWheel").then((count) => "W" + count);
  }

  static diffDate(startDate: Date, endDate: Date) {
    const end = moment(endDate),
      now = moment(startDate);
    return end.diff(now);
  }
}
