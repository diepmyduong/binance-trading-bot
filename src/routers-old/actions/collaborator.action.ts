import isBot from "isbot";

import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { SettingKey } from "../../configs/settingData";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { MemberModel } from "../../graphql/modules/member/member.model";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { MetadataGenerator } from "metatags-generator";

class CollaboratorAction extends BaseRoute {
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

    if (isBot(req.headers["user-agent"])) {
      const preparedData = await generateSEOData(req);
      return res.render("dynamic", preparedData);
    }
    if (!shortCode) throw ErrorHelper.requestDataInvalid(". Không có đường dẩn.");

    const collaborator = await CollaboratorModel.findOne({ shortCode });
    if (!collaborator) throw ErrorHelper.mgRecoredNotFound("cộng tác viên.");

    const member = await MemberModel.findById(collaborator.memberId);

    if (!member) throw ErrorHelper.mgQueryFailed("Thành viên");

    await CollaboratorModel.findByIdAndUpdate(
      collaborator.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    const shopUri = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN).then((webDomain: String) => {
      return `${webDomain}/?code=${member.code}&collaboratorId=${collaborator.id}`;
    });

    res.redirect(shopUri);
  }
}

export default new CollaboratorAction().router;
async function generateSEOData(req: Request) {
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
      title: title,
      description: desc,
      url: req.baseUrl,
      image: image,
    })
    .build();
  return preparedData;
}
