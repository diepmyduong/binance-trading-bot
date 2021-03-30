import { Job } from "agenda";
import moment from "moment-timezone";
import { CommissionLogModel, ICommissionLog } from "../../graphql/modules/commissionLog/commissionLog.model";
import { CumulativePointLogModel } from "../../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { Agenda } from "../agenda";

export class MemberCommissionJob {
  static jobName = "MemberCommission";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + MemberCommissionJob.jobName, moment().format());
    await doBusiness();
    return done();
  }
}

export default MemberCommissionJob;

const doBusiness = async () => {
  // console.log('doBusiness');

  const members = await MemberModel.find({ activated: true }).limit(1000);

  for (const member of members) {
    const commissionLogs = await CommissionLogModel.find({ memberId: member.id });
    if (commissionLogs.length > 0) {
      const totalCommission = commissionLogs.reduce((sum, { value }) => {
        return sum + value;
      }, 0);
      // console.log('total', total);
      if (member.commission !== totalCommission)
        await MemberModel.findByIdAndUpdate(member.id, { $set: { commission: totalCommission } }, { new: true });
    }

    const cummulativeLogs = await CumulativePointLogModel.find({ memberId: member.id });
    if (cummulativeLogs.length > 0) {
      const totalCummulativePoint = cummulativeLogs.reduce((sum, { value }) => {
        return sum + value;
      }, 0);
      // console.log('total', total);
      if (member.cumulativePoint !== totalCummulativePoint)
        await MemberModel.findByIdAndUpdate(member.id, { $set: { cumulativePoint: totalCummulativePoint } }, { new: true });
    }
  }
};