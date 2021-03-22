import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import fs from "fs";
import Axios from "axios";

class CommonRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/getLogo", this.route(this.getLogo));
  }

  async getLogo(req: Request, res: Response) {
    const logo: string = await SettingHelper.load(SettingKey.LOGO);
    res.redirect(logo);
  }
}

export default new CommonRoute().router;
