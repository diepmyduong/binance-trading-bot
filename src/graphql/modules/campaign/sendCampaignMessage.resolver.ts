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

  const headerChatParams = {
    apiKey: member.chatbotKey,
    psids: member.psids,
    message: headerMsg,
    context: {},
  };


  const headerChat = await chatBotService.sendChatBotMessage(headerChatParams);
  if (!headerChat.success) {
    return { success: false }
  }

  if (campaign.image) {
    const imageParams = {
      apiKey: member.chatbotKey,
      psids: member.psids,
      image: campaign.image,
      context: {
        campaignImage: campaign.image
      },
    };

    const imageChat = await chatBotService.sendChatBotImage(imageParams);
    if (!imageChat.success) {
      return { success: false }
    }
  }

  const LINK_AFFILIATE = affiliateLink;
  const HASH_TAGS = campaign.hashtags ? campaign.hashtags.map(tag => `#${tag} `).join('') : '';

  const contentParams = {
    apiKey: member.chatbotKey,
    psids: member.psids,
    message: `${campaign.content}

{{HASH_TAGS}}`,
    context: {
      LINK_AFFILIATE,
      HASH_TAGS
    },
  };

  const contentChat = await chatBotService.sendChatBotMessage(contentParams);

  return contentChat;
}