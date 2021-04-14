import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../../graphql/context";

import { auth } from "../../../middleware/auth";
import Excel from "exceljs";
import { UtilsHelper } from "../../../helpers";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../../graphql/modules/collaborator/collaborator.model";
import {
  CollaboratorImportingLogModel,
  ICollaboratorImportingLog,
} from "../../../graphql/modules/collaboratorImportingLog/collaboratorImportingLog.model";
import { CustomerModel } from "../../../graphql/modules/customer/customer.model";
import { Gender, MemberModel } from "../../../graphql/modules/member/member.model";
import { CustomerCommissionLogModel } from "../../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { ObjectId } from "mongodb";
import { set } from "lodash";
import { exportImportedCollaboratorsResultToExcel } from "./exportImportedCollaboratorsResultToExcel.collaborator";
import { exportToExcel } from "./exportToExcel.collaborator";
import { exportCollaboratorsReport } from "./exportCollaboratorsReport.collaborator";

const STT = "STT";
const NAME = "Tên";
const PHONE = "Số điện thoại";
const RESULT = "Kết quả";
const ERROR = "Lỗi";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";
const RESULT_IMPORT_FILE_NAME = "ket_qua_import_cong_tac_vien";
const RESULT_FILE_NAME = "danh_sach_cong_tac_vien";
const SHEET_NAME = "Sheet1";

const IS_COLLABORATOR = "Là CTV";
const ADDRESS = "Địa chỉ";
const GENDER = "Giới tính";
class CollaboratorRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results",[auth],this.route(exportImportedCollaboratorsResultToExcel));
    this.router.get("/export", [auth], this.route(exportToExcel));
    this.router.get("/exportCollaboratorsReport",[auth],this.route(exportCollaboratorsReport));
  }
}

export default new CollaboratorRoute().router;

// const test = {
// };
