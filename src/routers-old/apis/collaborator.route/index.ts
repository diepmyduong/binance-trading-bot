import {
  BaseRoute,
} from "../../../base/baseRoute";

import { auth } from "../../../middleware/auth";
import { exportImportedCollaboratorsResultToExcel } from "./exportImportedCollaboratorsResultToExcel.collaborator";
import { exportToExcel } from "./exportToExcel.collaborator";
import { exportCollaboratorsReport } from "./exportCollaboratorsReport.collaborator";
import { exportCollaboratorToQRPdf } from "./exportCollaboratorToQRPdf.collaborator";

class CollaboratorRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results",[auth],this.route(exportImportedCollaboratorsResultToExcel));
    this.router.get("/export", [auth], this.route(exportToExcel));
    this.router.get("/exportCollaboratorsReport",[auth],this.route(exportCollaboratorsReport));
    this.router.get("/exportCollaboratorToQRPdf",[auth],this.route(exportCollaboratorToQRPdf));    
  }
}

export default new CollaboratorRoute().router;

// const test = {
// };
