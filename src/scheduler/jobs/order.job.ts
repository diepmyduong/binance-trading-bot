import { Job } from "agenda";
import moment from "moment-timezone";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
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
  
  const host = await SettingHelper.load(SettingKey.DELIVERY_ENABLED_AUTO_APPROVE_ORDER);
}

// (async () => {
//   console.log('test businessssssssssssssssssssssss');
//   await doBusiness();
// })();
