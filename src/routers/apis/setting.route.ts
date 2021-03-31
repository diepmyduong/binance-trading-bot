import { SettingHelper } from "../../graphql/modules/setting/setting.helper";
import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
class SettingRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    // this.router.get("/getText/:key", this.route(this.getText));
    this.router.get("/redirect/:key", this.route(this.redirect));
  }

  // async getText(req: Request, res: Response) {
  //   const setting = await SettingHelper.load(req.params["key"] as any, { secure: false });
  //   return res.send(setting);
  // }

  async redirect(req: Request, res: Response) {
    const redirect = await SettingHelper.load(req.params["key"] as any, { secure: true });
    return res.redirect(redirect);
  }
}

export default new SettingRoute().router;
