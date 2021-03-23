// import { ErrorHelper } from "../../../base/error";
// import { SettingKey } from "../../../configs/settingData";
// import { ROLES } from "../../../constants/role.const";
// import { onSendChatBotText } from "../../../events/onSendToChatbot.event";
// import { AuthHelper } from "../../../helpers";
// import { FacebookHelper } from "../../../helpers/facebook.helper";
import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { FacebookHelper } from "../../../../helpers/facebook.helper";
import { Context } from "../../../context";
import { MemberModel } from "../../member/member.model";
import { CollaboratorProductModel } from "../collaboratorProduct.model";
// import { CampaignSocialResultModel, ICampaignSocialResult } from "../campaignSocialResult/campaignSocialResult.model";
// import { IMember, MemberLoader, MemberModel } from "../member/member.model";
// import { ProductModel, ProductType } from "../product/product.model";
// import { SettingHelper } from "../setting/setting.helper";
// import { UserModel } from "../user/user.model";

const Mutation = {
  trackProductUrlEngagement: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;

    const accessToken = args.accessToken;

    const member = await MemberModel.findById(context.id);
    if (accessToken) {
      member.facebookAccessToken = accessToken;
      await member.save();
    }

    const collaboratorProduct = await CollaboratorProductModel.findById(id);
    if (!collaboratorProduct)
      throw ErrorHelper.mgRecoredNotFound("cộng tác viên");

    if (!collaboratorProduct.shortUrl)
      throw ErrorHelper.mgRecoredNotFound("link giới thiệu sản phẩm");

    const engament = await FacebookHelper.getEngagement(collaboratorProduct.shortUrl, member.facebookAccessToken);
    if (!engament.success) {
      throw ErrorHelper.tokenExpired();
    }

    return await CollaboratorProductModel.findByIdAndUpdate(
      collaboratorProduct.id,
      {
        $set: {
          likeCount: engament.likeCount,
          shareCount: engament.shareCount,
          commentCount: engament.commentCount
        }
      },
      { new: true }
    );
  },
};

export default {
  Mutation,
};
