import { CrudService } from "../../../base/crudService";
import { CampaignSocialResultModel } from "./campaignSocialResult.model";
class CampaignSocialResultService extends CrudService<typeof CampaignSocialResultModel> {
  constructor() {
    super(CampaignSocialResultModel);
  }
}

const campaignSocialResultService = new CampaignSocialResultService();

export { campaignSocialResultService };
