import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { CampaignModel } from "../../graphql/modules/campaign/campaign.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { ProductModel, ProductType } from "../../graphql/modules/product/product.model";
import { CampaignSocialResultModel } from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { SettingKey } from "../../configs/settingData";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
class CollaboratorAction extends BaseRoute {
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

    const collaborator = await CollaboratorModel.findOne({ shortUrl });
    if (!collaborator)
      throw ErrorHelper.mgRecoredNotFound("cộng tác viên.");



    const member = await MemberModel.findById(collaborator.memberId);

    if (!member)
      throw ErrorHelper.mgQueryFailed("Thành viên");

    const shopUri = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN).then((webDomain: String) => {
      return `${webDomain}/?pageId=${member.fanpageId}&collaboratorId=${collaborator.id}`
    });
    
    res.redirect(shopUri);
  }
}


export default new CollaboratorAction().router;
