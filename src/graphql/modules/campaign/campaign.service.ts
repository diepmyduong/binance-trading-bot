import { CrudService } from "../../../base/crudService";
import { MemberModel } from "../member/member.model";
import { CampaignModel } from "./campaign.model";
class CampaignService extends CrudService<typeof CampaignModel> {
  constructor() {
    super(CampaignModel);
  }

  getCampaignByCode = async (campaignCode: any, sellerId: any) => {
    const campaign = await CampaignModel.findOne({ code: campaignCode });

    if (campaign) {
      if (campaign.memberIds.findIndex(id => id.toString() === sellerId) === -1)
        return null;

      return campaign;
    }
    return null;
  }

  getCampaignByCodeAndProduct = async (campaignCode: any, productId: any, sellerId: any) => {
    const campaign = await CampaignModel.findOne({ code: campaignCode, productId });
    if (campaign) {
      if (campaign.memberIds.findIndex(id => id.toString() === sellerId) === -1)
        return null;
      // console.log('========> campaign', campaign);
      return campaign;
    }
    return null;
  }
}

const campaignService = new CampaignService();

export { campaignService };
