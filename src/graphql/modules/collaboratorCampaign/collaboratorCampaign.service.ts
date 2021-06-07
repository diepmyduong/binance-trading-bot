import { CrudService } from "../../../base/crudService";
import { CollaboratorCampaignModel } from "./collaboratorCampaign.model";
class CollaboratorCampaignService extends CrudService<typeof CollaboratorCampaignModel> {
  constructor() {
    super(CollaboratorCampaignModel);
  }
}

const collaboratorCampaignService = new CollaboratorCampaignService();

export { collaboratorCampaignService };
