import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";

import { auth } from "../../../middleware/auth";
import { exportOrderToPdf } from "./exportOrderToPdf.order";
import { exportToMemberOrderToPdf } from "./exportToMemberOrderToPdf.order";
import { exportOrdersReport } from "./exportOrdersReport.order";

class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/exportOrderToPdf",[auth],this.route(exportOrderToPdf));
    this.router.get("/exportToMemberOrderToPdf",[auth],this.route(exportToMemberOrderToPdf));
    this.router.get("/exportOrdersReport",[auth],this.route(exportOrdersReport));
  }

}

export default new OrderRoute().router;