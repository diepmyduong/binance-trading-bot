import { CrudService } from "../../../base/crudService";
import { SettingKey } from "../../../configs/settingData";
import { KeycodeHelper } from "../../../helpers";
import { MemberLoader } from "../member/member.model";
import { SettingHelper } from "../setting/setting.helper";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { CollaboratorModel, CollaboratorStatus } from "./collaborator.model";

class CollaboratorService extends CrudService<typeof CollaboratorModel> {
  constructor() {
    super(CollaboratorModel);
  }
  async generateShortCode(sellerId: string, data: any) {
    const [host, member, shopConfig] = await Promise.all([
      SettingHelper.load(SettingKey.WEBAPP_DOMAIN),
      MemberLoader.load(sellerId),
      ShopConfigModel.findOne({ memberId: sellerId }),
    ]);
    const secret = `${data.phone}-${sellerId}`;
    let shortCode = KeycodeHelper.alpha(secret, 6);
    let shortUrl = `${host}/${member.code}/ctv/${shortCode}`;
    let countShortUrl = await CollaboratorModel.count({ shortUrl });
    while (countShortUrl > 0) {
      shortCode = KeycodeHelper.alpha(secret, 6);
      shortUrl = `${host}/ctv/${shortCode}`;
      countShortUrl = await CollaboratorModel.count({ shortUrl });
    }
    return {
      shortCode,
      shortUrl,
      status: shopConfig.colApprove ? CollaboratorStatus.PENDING : CollaboratorStatus.ACTIVE,
    };
  }
}

const collaboratorService = new CollaboratorService();

export { collaboratorService };
