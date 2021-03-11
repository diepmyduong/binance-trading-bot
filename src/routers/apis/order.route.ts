import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";

import { auth } from "../../middleware/auth";
class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/exportOrderToPdf", [auth], this.route(this.exportOrderToPdf));
  }

  async exportOrderToPdf(req: Request, res: Response) {
  
  }
}


export default new OrderRoute().router;
