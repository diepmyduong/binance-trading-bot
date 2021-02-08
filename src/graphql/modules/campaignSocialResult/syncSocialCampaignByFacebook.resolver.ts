import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { onSendChatBotText } from "../../../events/onSendToChatbot.event";
import { AuthHelper } from "../../../helpers";
import { FacebookHelper } from "../../../helpers/facebook.helper";
import { Context } from "../../context";
import { CampaignSocialResultModel, ICampaignSocialResult } from "../campaignSocialResult/campaignSocialResult.model";
import { IMember, MemberLoader, MemberModel } from "../member/member.model";
import { ProductModel, ProductType } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { UserModel } from "../user/user.model";

const Mutation = {
  syncSocialCampaignByFacebook: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { campaignId } = args;

    const accessToken = args.accessToken;

    const user = await UserModel.findById(context.id);
    if (accessToken) {
      user.facebookAccessToken = accessToken;
      await user.save();
    }

    const campaignSocialResult = await CampaignSocialResultModel.find({ campaignId });
    // console.log('------------------->campaignSocialResult', campaignSocialResult);

    let results: any[] = [];


    const validFirstResult = await FacebookHelper.getEngagement(campaignSocialResult[0].affiliateLink, user.facebookAccessToken);
    if (!validFirstResult.success) {
      throw ErrorHelper.tokenExpired();
    }

    for (const campaignResult of campaignSocialResult) {
      const result: ICampaignSocialResult = campaignResult;
      const engagement = await FacebookHelper.getEngagement(result.affiliateLink, user.facebookAccessToken);

      if (engagement.success) {
        const {
          likeCount, shareCount, commentCount
        } = engagement;

        const newResult: ICampaignSocialResult = await CampaignSocialResultModel.findByIdAndUpdate(
          result.id,
          {
            $set: {
              likeCount,
              shareCount,
              commentCount
            }
          },
          { new: true }
        );
        newResult.synced = true;
        results.push(newResult);
      }
      else {
        result.synced = false;
        results.push(result);
      }
    }
    return results;
  },
};

export default {
  Mutation,
};
