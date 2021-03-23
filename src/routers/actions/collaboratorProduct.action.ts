import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
// import { CampaignModel } from "../../graphql/modules/campaign/campaign.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
// import { ProductModel, ProductType } from "../../graphql/modules/product/product.model";
// import { CampaignSocialResultModel } from "../../graphql/modules/campaignSocialResult/campaignSocialResult.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { SettingKey } from "../../configs/settingData";
// import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../graphql/modules/collaboratorProduct/collaboratorProduct.model";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
class CollaboratorProductAction extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/:shortCode", this.route(this.index));
  }
  //{{host}}/api/campaign?campaign=C10004&page=243084826060782&product=sms-all
  async index(req: Request, res: Response) {
    const shortCode: any = req.params.shortCode;
    // console.log('shortUrl', shortUrl);

    if (!shortCode)
      throw ErrorHelper.requestDataInvalid(". Không có đường dẩn.");

    const collaProduct = await CollaboratorProductModel.findOne({ shortCode });
    if (!collaProduct)
      throw ErrorHelper.mgRecoredNotFound("link giới thiệu sản phẩm.");

    const collaborator = await CollaboratorModel.findById(
      collaProduct.collaboratorId
    );

    const member = await MemberModel.findById(collaborator.memberId);

    if (!member) throw ErrorHelper.mgQueryFailed("Thành viên");

    const shopUri = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN).then(
      (webDomain: String) => {
        return `${webDomain}/?code=${member.code}&collaboratorId=${collaborator.id}&productId=${collaProduct.productId}`;
      }
    );

    res.redirect(shopUri);
  }
}

export default new CollaboratorProductAction().router;
