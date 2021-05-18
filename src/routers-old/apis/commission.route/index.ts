import { BaseRoute } from "../../../base/baseRoute";
import { auth } from "../../../middleware/auth";
import { exportCommissionOrderReport } from "./exportCommissionOrderReport.commission";

class CommissionRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/exportCommissionReport", [auth], this.route(exportCommissionOrderReport));
  }
}

export default new CommissionRoute().router;
