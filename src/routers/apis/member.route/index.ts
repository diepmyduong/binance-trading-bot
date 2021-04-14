import {
  BaseRoute,
} from "../../../base/baseRoute";
import { auth } from "../../../middleware/auth";
import { exportImportedMembersResultToExcel } from "./exportImportedMembersResultToExcel.member";
import { exportPortReport } from "./exportPortReport.member";
import { exportPortCommissionReport } from "./exportPortCommissionReport.member";

class MemberRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results", [auth], this.route(exportImportedMembersResultToExcel));
    this.router.get("/exportPortReport", [auth], this.route(exportPortReport));
    this.router.get("/exportPortWithCommissionReport", [auth], this.route(exportPortCommissionReport));
  }
}

export default new MemberRoute().router;