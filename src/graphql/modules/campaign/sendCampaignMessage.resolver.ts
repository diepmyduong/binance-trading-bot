import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { CampaignSocialResultModel, ICampaignSocialResult, MessageReceivingStatus } from "../campaignSocialResult/campaignSocialResult.model";
import { chatBotService } from "../chatBot/chatBot.service";
import { IMember, MemberLoader, MemberModel } from "../member/member.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { CampaignHelper } from "./campaign.helper";
import { CampaignLoader, CampaignModel, ICampaign } from "./campaign.model";
import { campaignService } from "./campaign.service";

const Mutation = {
  sendCampaignMessage: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);

    const { id } = args;

    const campaign = await CampaignModel.findById(id);

    const { memberIds, productId } = campaign

    const [members, product] = await Promise.all([
      MemberModel.find({ _id: { $in: memberIds } }),
      ProductModel.findById(productId)
    ]);

    if (Object.keys(members).length === 0)
      throw ErrorHelper.recoredNotFound('Không có thành viên để gửi messenger');

    for (const member of members) {
      // console.log('member', member);
      const existedCampaignSocial = await CampaignSocialResultModel.findOne({
        campaignId: campaign.id,
        memberId: member.id
      });

      if (existedCampaignSocial) {
        const chatResult = await sendMessage(member, product, campaign, existedCampaignSocial.affiliateLink);

        if (chatResult.success) {
          existedCampaignSocial.messageReceivingStatus = MessageReceivingStatus.SENT;
        }
        else {
          existedCampaignSocial.messageReceivingStatus = MessageReceivingStatus.ERROR;
        }
        // console.log('existedCampaignSocial', existedCampaignSocial);
        await existedCampaignSocial.save();
      }
    }
    return campaign;
  },
};

export default {
  Mutation,
};


const sendMessage = async (member: IMember, product: IProduct, campaign: ICampaign, affiliateLink: String) => {
  const [headerMsg] = await Promise.all([
    SettingHelper.load(SettingKey.CAMPAIGN_HEADER_MSG_FOR_SHOPPER),
  ]);

  let { chatbotKey ,psids } = member;

  psids = psids.filter( id => id !== null);

  if(psids.length === 0){
    return { success: false };
  }

  const headerChatParams = {
    apiKey: chatbotKey,
    psids: psids,
    message: headerMsg,
    context: {},
  };

  // console.log("headerChatParams", headerChatParams);
  const headerChat = await chatBotService.sendChatBotMessage(headerChatParams);
  // console.log("headerChat", headerChat);
  if (!headerChat.success) {
    return { success: false }
  }

  if (campaign.image) {
    const imageParams = {
      apiKey: chatbotKey,
      psids: psids,
      image: campaign.image,
      context: {
        campaignImage: campaign.image
      },
    };

    // console.log("imageParams", imageParams);
    const imageChat = await chatBotService.sendChatBotImage(imageParams);
    // console.log("imageChat", imageChat);
    if (!imageChat.success) {
      return { success: false }
    }
  }

  const LINK_AFFILIATE = affiliateLink;
  const HASH_TAGS = campaign.hashtags ? campaign.hashtags.map(tag => `#${tag} `).join('') : '';
  const contentParams = {
    apiKey: chatbotKey,
    psids: psids,
    message: `${campaign.content}

{{HASH_TAGS}}`,
    context: {
      LINK_AFFILIATE,
      HASH_TAGS
    },
  };



  // console.log("contentParams", contentParams);
  const contentChat = await chatBotService.sendChatBotMessage(contentParams);
  // console.log("contentChat", contentChat);

  return contentChat;
}