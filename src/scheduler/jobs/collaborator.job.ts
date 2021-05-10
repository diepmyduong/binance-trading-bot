import { Job } from "agenda";
import moment from "moment-timezone";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { Agenda } from "../agenda";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { KeycodeHelper } from "../../helpers";

export class CollaboratorJob {
  static jobName = "Collaborator";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + CollaboratorJob.jobName, moment().format());
    await updateCustomerId();
    await updateShortCodes();
    await updateShortUrls();
    return done();
  }
}

export default CollaboratorJob;

const updateCustomerId = async () => {
  // console.log('doBusiness');

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

  const collaborators = await CollaboratorModel.find({
    $or: [{ customerId: { $exists: false } }, { customerId: null }],
  }).limit(1000);

  

  // console.log('collaborators',collaborators);

  const collaboratorPhones = collaborators.map((col) => col.phone);

  const customers = await CustomerModel.find({
    phone: { $in: collaboratorPhones },
  });
  // console.log("members", memberss);

  for (const customer of customers) {
    const collaborator = collaborators.find(
      (col) => col.phone === customer.phone
    );
    if (collaborator) {
      if(collaborator.customerId){
        if(customer.name === "Khách vãng lai"){
          await CustomerModel.findByIdAndUpdate(collaborator.customerId, { $set: {
            name: collaborator.name
          } }, { new: true });
        }
      }
      else{
        await CollaboratorModel.findByIdAndUpdate(
          collaborator.id,
          {
            $set: {
              customerId: customer._id,
            },
          },
          { new: true }
        );
      }

      if(!collaborator.shortUrl){
        const collaboratorId = collaborator.id;
        const memberId = collaborator.memberId;
        const customerId = collaborator.customerId;
        const secret = `${collaboratorId.toString()}-${customerId.toString()}-${memberId.toString()}`;
  
        let shortCode = KeycodeHelper.alpha(secret, 6);
        let shortUrl = `${host}/ctv/${shortCode}`;
  
        let countShortUrl = await CollaboratorModel.count({ shortUrl });
        while (countShortUrl > 0) {
          shortCode = KeycodeHelper.alpha(secret, 6);
          shortUrl = `${host}/ctv/${shortCode}`;
          countShortUrl = await CollaboratorModel.count({ shortUrl });
        }

        await CollaboratorModel.findByIdAndUpdate(
          collaborator.id,
          {
            $set: {
              shortUrl,
            },
          },
          { new: true }
        );
      }
    }
  }
};


const updateShortCodes = async () => {
  // console.log('doBusiness');

  const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

  const collaborators = await CollaboratorModel.find({
    $or: [{ shortCode: { $exists: false } }, { shortCode: null }],
  }).limit(1000);

  // console.log('collaborators',collaborators);

  const collaboratorPhones = collaborators.map((col) => col.phone);

  const customers = await CustomerModel.find({
    phone: { $in: collaboratorPhones },
  });
  // console.log("members", memberss);

  for (const customer of customers) {
    const collaborator = collaborators.find(
      (col) => col.phone === customer.phone
    );
    if (collaborator) {

      if(!collaborator.shortCode){
        const collaboratorId = collaborator.id;
        const memberId = collaborator.memberId;
        const customerId = collaborator.customerId;
        const secret = `${collaboratorId.toString()}-${customerId.toString()}-${memberId.toString()}`;
  
        let shortCode = KeycodeHelper.alpha(secret, 6);
        let shortUrl = `${host}/ctv/${shortCode}`;
  
        let countShortUrl = await CollaboratorModel.count({ shortUrl });
        while (countShortUrl > 0) {
          shortCode = KeycodeHelper.alpha(secret, 6);
          shortUrl = `${host}/ctv/${shortCode}`;
          countShortUrl = await CollaboratorModel.count({ shortUrl });
        }

        await CollaboratorModel.findByIdAndUpdate(
          collaborator.id,
          {
            $set: {
              shortUrl,
              shortCode
            },
          },
          { new: true }
        );
      }
    }
  }
  
};


const updateShortUrls = async () => {
  // console.log('doBusiness');

  const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);

  let collaborators = await CollaboratorModel.find({
  }).limit(1000);

  collaborators = collaborators.filter(col=>!col.shortUrl.includes(host))

  // console.log('collaborators',collaborators.length);
  // console.log("members", memberss);
  for (const collaborator of collaborators) {
    if (collaborator.shortCode) {
      console.log("collaborator.shortCode", collaborator.shortCode);
      const shortUrl = `${host}/ctv/${collaborator.shortCode}`;
      await CollaboratorModel.findByIdAndUpdate(
        collaborator.id,
        {
          $set: {
            shortUrl,
          },
        },
        { new: true }
      );
    }
}
  
};

// (async () => {
//   console.log("test businessssssssssssssssssssssss");
//   await updateShortUrls();
// })();

