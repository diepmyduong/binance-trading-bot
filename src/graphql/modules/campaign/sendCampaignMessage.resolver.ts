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

    const { memberIds } = campaign;


    if (Object.keys(memberIds).length === 0)
      throw ErrorHelper.recoredNotFound('Không có thành viên để gửi messenger');

    for (const memberId of memberIds) {
      // console.log('member', member);
      const existedCampaignSocial = await CampaignSocialResultModel.findOne({
        campaignId: campaign.id,
        memberId
      });

      if (existedCampaignSocial) {
        await CampaignSocialResultModel.findByIdAndUpdate(existedCampaignSocial.id, { $set: { messageReceivingStatus: MessageReceivingStatus.PENDING } })
      }
    }
    return campaign;
  },
};

export default {
  Mutation,
};