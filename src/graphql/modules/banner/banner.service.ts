import { CrudService } from "../../../base/crudService";
import { BannerModel } from "./banner.model";
class BannerService extends CrudService<typeof BannerModel> {
  constructor() {
    super(BannerModel);
  }
}

const bannerService = new BannerService();

export { bannerService };
