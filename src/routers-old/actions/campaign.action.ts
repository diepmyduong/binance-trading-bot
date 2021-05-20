import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { SettingKey } from "../../configs/settingData";
import { CampaignModel } from "../../graphql/modules/campaign/campaign.model";
import { CampaignSocialResultModel } from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { ProductModel } from "../../graphql/modules/product/product.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import isBot from "isbot";

class CampaignAction extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/:shortUrl", this.route(this.index));
  }
  //{{host}}/api/campaign?campaign=C10004&page=243084826060782&product=sms-all
  async index(req: Request, res: Response) {
    const shortUrl: any = req.params.shortUrl;
    // console.log('shortUrl', shortUrl);
    if (isBot(req.headers["user-agent"])) {
      console.log("IS BOT!!!");
    }

    if (!shortUrl) throw ErrorHelper.requestDataInvalid(". Không có đường dẩn.");

    const campaignResult = await CampaignSocialResultModel.findOne({ shortUrl });
    if (!campaignResult) throw ErrorHelper.mgRecoredNotFound("Chiến dịch");

    const [member, product, campaign] = await Promise.all([
      MemberModel.findById(campaignResult.memberId),
      ProductModel.findById(campaignResult.productId),
      CampaignModel.findById(campaignResult.campaignId),
    ]);

    if (!member) throw ErrorHelper.mgQueryFailed("Thành viên");

    if (!product) throw ErrorHelper.mgQueryFailed("Sản phẩm");

    if (!campaign) throw ErrorHelper.mgQueryFailed("Chiến dịch");

    if (campaign.memberIds.findIndex((id) => id.toString() === member.id.toString()) === -1)
      throw ErrorHelper.mgQueryFailed("Thành viên");

    // // tạo 1 campaign result
    // // //https://mb-ashop-web.web.app/login?psid=3765204193532396&pageId=110641874040900

    const shopUri = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN).then((webDomain: String) => {
      return `${webDomain}/?code=${member.code}&campaignCode=${campaign.code}&productId=${campaign.productId}`;
    });

    // console.log('shopUri', shopUri);
    res.redirect(shopUri);
    // this.response(res, { campaignResult });
  }
}

export default new CampaignAction().router;
