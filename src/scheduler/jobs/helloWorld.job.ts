import { Job } from "agenda";
import moment from "moment-timezone";
import { Agenda } from "../agenda";

export class HelloWorldJob {
  static jobName = "HelloWorld";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static execute(job: Job) {
    console.log("Execute Job " + HelloWorldJob.jobName, moment().format());
  }
}

export default HelloWorldJob;
