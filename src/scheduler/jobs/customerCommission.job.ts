import { Job } from "agenda";
import moment from "moment-timezone";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { CustomerCommissionLogModel } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { CustomerPointLogModel } from "../../graphql/modules/customerPointLog/customerPointLog.model";
import { Agenda } from "../agenda";

export class CustomerCommissionJob {
  static jobName = "MemberCommission";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + CustomerCommissionJob.jobName, moment().format());
    await doBusiness();
    return done();
  }
}

export default CustomerCommissionJob;

const doBusiness = async () => {

  const customers = await CustomerModel.find({}).limit(1000);

  for (const customer of customers) {
    const commissionLogs = await CustomerCommissionLogModel.find({ customerId: customer.id });
    if (commissionLogs.length > 0) {
      const totalCommission = commissionLogs.reduce((sum, { value }) => {
        return sum + value;
      }, 0);
      // console.log('total', total);
      if (customer.commission !== totalCommission)
        await CustomerModel.findByIdAndUpdate(customer.id, { $set: { commission: totalCommission } }, { new: true });
    }

    const customerPointLogs = await CustomerPointLogModel.find({ customerId: customer.id });
    if (customerPointLogs.length > 0) {
      const totalPoint = customerPointLogs.reduce((sum, { value }) => {
        return sum + value;
      }, 0);
      // console.log('total', total);
      if (customer.cumulativePoint !== totalPoint)
        await CustomerModel.findByIdAndUpdate(customer.id, { $set: { cumulativePoint: totalPoint } }, { new: true });
    }
  }
};