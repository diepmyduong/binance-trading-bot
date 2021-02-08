import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { CampaignModel } from "../../graphql/modules/campaign/campaign.model";
import { LuckyWheelModel } from "../../graphql/modules/luckyWheel/luckyWheel.model";
import { GiftType } from "../../graphql/modules/luckyWheelGift/luckyWheelGift.model";
import { LuckyWheelResultModel, SpinStatus } from "../../graphql/modules/luckyWheelResult/luckyWheelResult.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { ProductModel, ProductType } from "../../graphql/modules/product/product.model";
import { UtilsHelper } from "../../helpers";
import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { ObjectId } from "mongodb";
import { CampaignSocialResultModel } from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { SettingKey } from "../../configs/settingData";
import { IOrderItem } from "../../graphql/modules/orderItem/orderItem.model";
import { OrderStatus } from "../../graphql/modules/order/order.model";
import { IRegisSMS, RegisSMSStatus } from "../../graphql/modules/regisSMS/regisSMS.model";
import { IRegisService, RegisServiceStatus } from "../../graphql/modules/regisService/regisService.model";
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

    if (!shortUrl)
      throw ErrorHelper.requestDataInvalid(". Không có đường dẩn.");

    const campaignResult = await CampaignSocialResultModel.findOne({ shortUrl });
    if (!campaignResult)
      throw ErrorHelper.mgRecoredNotFound("Chiến dịch");



    const [member, product, campaign] = await Promise.all([
      MemberModel.findById(campaignResult.memberId),
      ProductModel.findById(campaignResult.productId),
      CampaignModel.findById(campaignResult.campaignId)
    ]);

    if (!member)
      throw ErrorHelper.mgQueryFailed("Thành viên");

    if (!product)
      throw ErrorHelper.mgQueryFailed("Sản phẩm");

    if (!campaign)
      throw ErrorHelper.mgQueryFailed("Chiến dịch");

    if (campaign.memberIds.findIndex(id => id.toString() === member.id.toString()) === -1)
      throw ErrorHelper.mgQueryFailed("Thành viên");


    // // tạo 1 campaign result 
    // // //https://mb-ashop-web.web.app/login?psid=3765204193532396&pageId=110641874040900

    const shopUri = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN).then((webDomain: String) => {
      return `${webDomain}/?pageId=${member.fanpageId}&campaignCode=${campaign.code}&productId=${campaign.productId}`
    });

    // console.log('shopUri', shopUri);
    res.redirect(shopUri);
    // this.response(res, { campaignResult });
  }
}


export default new CampaignAction().router;
