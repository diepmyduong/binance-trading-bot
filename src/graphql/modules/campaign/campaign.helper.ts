import { CounterModel } from "../counter/counter.model";
import { counterService } from "../counter/counter.service";
import { ICampaign } from "./campaign.model";
import moment from 'moment';
export class CampaignHelper {
  constructor(public luckyWheel: ICampaign) { }
  static async generateCode() {
    return await counterService.trigger("campaign").then((count) => "C" + count);
  }

  static diffDate(startDate: Date, endDate: Date) {
    const end = moment(endDate),
      now = moment(startDate);
    return end.diff(now);
  }
}
