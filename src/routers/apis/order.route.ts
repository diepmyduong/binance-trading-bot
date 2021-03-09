import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";

import { auth } from "../../middleware/auth";
class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export", [auth], this.route(this.exportToPDF));
  }

  async exportToPDF(req: Request, res: Response) {
  
  }
}


export default new OrderRoute().router;
