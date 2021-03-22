import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { UtilsHelper } from "../../helpers";
import { auth } from "../../middleware/auth";
import { SettingKey } from "../../configs/settingData";
import { SettingHelper } from "../../graphql/modules/setting/setting.helper";

class EVoucherRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/getLogo", this.route(this.getLogo));
  }

  async getLogo(req: Request, res: Response) {
    const logo = await SettingHelper.load(SettingKey.LOGO);
    res.json({
      imgUrl : logo
    })
  }
}

export default new EVoucherRoute().router;
