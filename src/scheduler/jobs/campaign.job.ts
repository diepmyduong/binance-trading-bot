import { Job } from "agenda";
import { set } from "lodash";
import moment from "moment-timezone";
import { SettingKey } from "../../configs/settingData";
import {
  CampaignLoader,
  CampaignModel,
  ICampaign,
} from "../../graphql/modules/campaign/campaign.model";
import {
  CampaignSocialResultModel,
  MessageReceivingStatus,
} from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { chatBotService } from "../../graphql/modules/chatBot/chatBot.service";
import {
  IMember,
  MemberLoader,
  MemberModel,
} from "../../graphql/modules/member/member.model";
import {
  IProduct,
  ProductModel,
} from "../../graphql/modules/product/product.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { Agenda } from "../agenda";

export class CampaignJob {
  static jobName = "Campaign";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job, done: any) {
    console.log("Execute Job " + CampaignJob.jobName, moment().format());
    await recordMessenger();
    return done();
  }
}

export default CampaignJob;

const recordMessenger = async () => {
  const campaignRecords = await CampaignSocialResultModel.find({
    messageReceivingStatus: MessageReceivingStatus.PENDING,
  }).limit(1000);

  const chatbotKey = await SettingHelper.load(SettingKey.CHATBOT_API_KEY);
  // console.log("chatbotKey", chatbotKey);
  // console.log("campaignRecords.length", campaignRecords.length);
  for (const record of campaignRecords) {
    const [member, campaign] = await Promise.all([
      MemberLoader.load(record.memberId),
      CampaignLoader.load(record.campaignId),
    ]);

    const result: any = await sendAllMessages(
      member,
      campaign,
      record.affiliateLink,
      chatbotKey
    );
    // console.log("result", result);
    const params = {};
    if (result.success) {
      set(params, "messageReceivingStatus", MessageReceivingStatus.SENT);
    } else {
      set(params, "messageReceivingStatus", MessageReceivingStatus.ERROR);
      set(params, "messageReceivingError", result.error);
    }
    await CampaignSocialResultModel.findByIdAndUpdate(record.id, {
      $set: params,
    });
  }
};

const sendAllMessages = async (
  member: IMember,
  campaign: ICampaign,
  affiliateLink: String,
  chatbotKey: String
) => {
  // console.log('sendAllMessages');
  let {
    // chatbotKey,
    psids,
  } = member;
  psids = psids.filter((id: string) => id !== null);
  // console.log("psids", psids);
  if (psids.length === 0) {
    return { success: false };
  }

  //1.
  let result = await sendHeaderMessage(chatbotKey, psids);
  // console.log('result', result);
  if (!result.success) return { success: false, error: result.error };

  //2.
  if (campaign.image) {
    result = await sendImageMessage(chatbotKey, psids, campaign.image);
    // console.log('result', result);
    if (!result.success) return { success: false, error: result.error };
  }

  //3.
  result = await sendBodyMessage(chatbotKey, psids, affiliateLink, campaign);
  // console.log('resulta', result);
  if (!result.success) return { success: false, error: result.error };

  return result;
};

const sendBodyMessage = async (
  chatbotKey: any,
  psids: any,
  affiliateLink: any,
  campaign: ICampaign
) => {
  const LINK_AFFILIATE = affiliateLink;
  const HASH_TAGS = campaign.hashtags
    ? campaign.hashtags.map((tag: string) => `#${tag} `).join("")
    : "";
  const contentParams = {
    apiKey: chatbotKey,
    psids: psids,
    message: `${campaign.content}

{{HASH_TAGS}}`,
    context: {
      LINK_AFFILIATE,
      HASH_TAGS,
    },
  };

  // console.log("contentParams", contentParams);
  return await chatBotService.sendChatBotMessage(contentParams);
};

const sendHeaderMessage = async (chatbotKey: any, psids: any) => {
  const message = await SettingHelper.load(
    SettingKey.CAMPAIGN_HEADER_MSG_FOR_SHOPPER
  );
  return await chatBotService.sendChatBotMessage({
    apiKey: chatbotKey,
    psids: psids,
    message,
    context: {},
  });
};

const sendImageMessage = async (chatbotKey: any, psids: any, image: string) => {
  const imageParams = {
    apiKey: chatbotKey,
    psids: psids,
    image: image,
    context: {
      campaignImage: image,
    },
  };

  // console.log("imageParams", imageParams);
  return await chatBotService.sendChatBotImage(imageParams);
};

(async () => {
  // console.log("test businessssssssssssssssssssssss");
  await recordMessenger();
})();
