import { CounterModel } from "../counter/counter.model";
import { counterService } from "../counter/counter.service";
import moment from 'moment';
import { ILuckyWheelGift } from "./luckyWheelGift.model";
export class LuckyWheelGiftHelper {
  constructor(public luckyWheelGift: ILuckyWheelGift) { }
  static async generateCode() {
    return await counterService.trigger("luckyWheelGift").then((count) => "WG" + count);
  }
}
