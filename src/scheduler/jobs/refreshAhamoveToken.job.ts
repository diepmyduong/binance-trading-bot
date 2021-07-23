import { Job } from "agenda";
import moment from "moment-timezone";

import { MemberModel } from "../../graphql/modules/member/member.model";
import { shopConfigService } from "../../graphql/modules/shopConfig/shopConfig.service";
import { Ahamove } from "../../helpers/ahamove/ahamove";
import { Agenda } from "../agenda";

export class RefreshAhamoveTokenJob {
  static jobName = "RefreshAhamoveToken";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job) {
    console.log("Execute Job " + RefreshAhamoveTokenJob.jobName, moment().format());
    const members = await MemberModel.find({});
    const ahamove = new Ahamove({});
    for (const m of members) {
      try {
        await shopConfigService.setAhamoveToken(m);
      } catch (err) {
        console.log("Error", err.message);
      }
    }
  }
}

export default RefreshAhamoveTokenJob;
