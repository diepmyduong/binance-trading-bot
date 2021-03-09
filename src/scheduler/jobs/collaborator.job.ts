import { Job } from "agenda";
import moment from "moment-timezone";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { Agenda } from "../agenda";

export class CollaboratorJob {
  static jobName = "Collaborator";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    // await doBusiness();

    return done();
  }
}

export default CollaboratorJob;

const doBusiness = async () => {
  // console.log('doBusiness');

  const collaborators = await CollaboratorModel.find({
    $or: [{ customerId: { $exists: false } }, { customerId: null }],
  }).limit(1000);

  

};

(async () => {
  console.log("test businessssssssssssssssssssssss");
  await doBusiness();
})();
