import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { SettingKey } from "../../configs/settingData";
import {
  CollaboratorLoader,
  CollaboratorModel,
} from "../../graphql/modules/collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../graphql/modules/collaboratorProduct/collaboratorProduct.model";
import { MemberLoader, MemberModel } from "../../graphql/modules/member/member.model";
import { IProduct, ProductLoader } from "../../graphql/modules/product/product.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { MetadataGenerator } from "metatags-generator";
import isBot from "isbot";
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
    if (!shortCode) throw ErrorHelper.requestDataInvalid(". Không có đường dẩn.");
    const collaProduct = await CollaboratorProductModel.findOne({ shortCode });
    if (!collaProduct) throw ErrorHelper.mgRecoredNotFound("link giới thiệu sản phẩm.");
    const [collaborator, product, webDomain] = await Promise.all([
      CollaboratorLoader.load(collaProduct.collaboratorId),
      ProductLoader.load(collaProduct.productId),
      SettingHelper.load(SettingKey.WEBAPP_DOMAIN),
    ]);
    if (isBot(req.headers["user-agent"])) {
      const preparedData = await generateSEOData(req, product);
      return res.render("dynamic", preparedData);
    }
    const member = await MemberModel.findById(collaborator.memberId).select("_id code");
    if (!member) throw ErrorHelper.mgQueryFailed("Thành viên");
    await CollaboratorProductModel.updateOne({ _id: collaProduct.id }, { $inc: { clickCount: 1 } });
    const shopUri = `${webDomain}/?code=${member.code}&collaboratorId=${collaborator.id}&productId=${collaProduct.productId}`;
    res.redirect(shopUri);
  }
}

export default new CollaboratorProductAction().router;

async function generateSEOData(req: Request, product: IProduct) {
  const generator = new MetadataGenerator();
  const [title, desc, image, logo] = await SettingHelper.loadMany([
    SettingKey.SEO_TITLE,
    SettingKey.SEO_DESCRIPTION,
    SettingKey.SEO_IMAGE,
    SettingKey.LOGO,
  ]);
  const preparedData = generator
    .setRobots("index")
    .setRobots("index, follow")
    .setProjectMeta({
      name: title,
      url: req.baseUrl,
      logo: logo,
    })
    .setPageMeta({
      title: product.name,
      description: `${toMoney(product.basePrice)} VNĐ`,
      url: req.baseUrl,
      image: product.image || image,
    })
    .build();
  return preparedData;
}

function toMoney(text = 0, digit = 0) {
  try {
    var re = "\\d(?=(\\d{3})+" + (digit > 0 ? "\\." : "$") + ")";
    return text.toFixed(Math.max(0, ~~digit)).replace(new RegExp(re, "g"), "$&,");
  } catch (err) {
    return "NAN";
  }
}
