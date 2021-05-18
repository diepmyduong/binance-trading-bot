import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";

import { auth } from "../../../middleware/auth";

import { exportProductReport } from './exportProductReport.product';

class ProductRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/exportProductReport", [auth], this.route(exportProductReport));
  }

}

export default new ProductRoute().router;