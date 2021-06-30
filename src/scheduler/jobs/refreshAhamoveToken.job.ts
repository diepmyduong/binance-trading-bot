import { Job } from "agenda";
import { compact, get, keyBy } from "lodash";
import moment from "moment-timezone";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { IShopBranch, ShopBranchModel } from "../../graphql/modules/shopBranch/shopBranch.model";
import { ShopConfigModel } from "../../graphql/modules/shopConfig/shopConfig.model";
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
        const address = compact([m.address, m.ward, m.district, m.province]).join(", ");
        const account = await ahamove.regisUserAccount({
          name: m.shopName,
          mobile: m.phone,
          address,
        });
        await ShopConfigModel.updateOne(
          { memberId: m._id },
          { $set: { shipAhamoveToken: account.token } },
          { upsert: true }
        ).exec();
      } catch (err) {
        console.log("Error", err.message);
      }
    }
  }
}

export default RefreshAhamoveTokenJob;
