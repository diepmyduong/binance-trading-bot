import { Job } from "agenda";
import moment from "moment-timezone";

import { onGivenGifts } from "../../events/onGivenGifts.event";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../../graphql/modules/customerPointLog/customerPointLog.model";
import { customerPointLogService } from "../../graphql/modules/customerPointLog/customerPointLog.service";
import { EVoucherItemModel } from "../../graphql/modules/eVoucherItem/eVoucherItem.model";
import { LuckyWheelModel, WheelStatus } from "../../graphql/modules/luckyWheel/luckyWheel.model";
import { GiftType, ILuckyWheelGift, LuckyWheelGiftModel } from "../../graphql/modules/luckyWheelGift/luckyWheelGift.model";
import { ILuckyWheelResult, LuckyWheelResultModel, SpinStatus } from "../../graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { Agenda } from "../agenda";


export class OrderJob {
  static jobName = "Order";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    // await doBusiness();

    return done();
  }
}

export default OrderJob;

const doBusiness = async() => {

}

// (async () => {
//   console.log('test businessssssssssssssssssssssss');
//   await doBusiness();
// })();
