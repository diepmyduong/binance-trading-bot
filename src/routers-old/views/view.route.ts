import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { configs } from "../../configs";

class ViewRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/loginPhone", this.route(this.login));
    this.router.get("/loginEmail", this.route(this.loginEmail));
  }

  async login(req: Request, res: Response) {
    res.render("loginPhone", {
      config: configs.firebaseView,
    });
  }

  async loginEmail(req: Request, res: Response) {
    res.render("loginEmail", {
      config: configs.firebaseView,
    });
  }
}

export default new ViewRoute().router;
