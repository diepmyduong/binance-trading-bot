import { Job } from "agenda";
import moment from "moment-timezone";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import LocalBroker from "../../services/broker";
import { Agenda } from "../agenda";

export class UpdateCustomerContextJob {
  static jobName = "UpdateCustomerContext";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + UpdateCustomerContextJob.jobName, moment().format());
    const cursor = CustomerModel.find({}).select("_id").cursor();
    cursor.on("data", (c) => {
      LocalBroker.call("customerContext.estimateOrder", { customerId: c._id.toString() });
    });
    cursor.on("end", () => {
      done();
      cursor.close();
    });
    cursor.on("error", () => {
      done();
      cursor.close();
    });
  }
}

export default UpdateCustomerContextJob;
