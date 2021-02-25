import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";

import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { UtilsHelper } from "../../helpers";
import {
  CollaboratorModel,
  ICollaborator,
} from "../../graphql/modules/collaborator/collaborator.model";
import {
  CollaboratorImportingLogModel,
  ICollaboratorImportingLog,
} from "../../graphql/modules/collaboratorImportingLog/collaboratorImportingLog.model";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { Gender } from "../../graphql/modules/member/member.model";

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
    this.router.get(
      "/export-import-results",
      [auth],
      this.route(this.exportResultsToExcel)
    );
    this.router.get("/export", [auth], this.route(this.exportToExcel));
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    let data: any[] = [];
    const logs = await CollaboratorImportingLogModel.find({}).sort({
      line: 1,
    });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(SHEET_NAME);
    const excelHeaders = [STT, NAME, PHONE, RESULT, ERROR];

    sheet.addRow(excelHeaders);

    data.forEach((d: ICollaboratorImportingLog, i) => {
      const dataRow = [
        d.no,
        d.name,
        d.phone,
        d.success ? THANH_CONG : LOI,
        d.error,
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_IMPORT_FILE_NAME);
  }

  async exportToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    const params: ICollaborator = null;

    if (context.isMember()) {
      params.memberId = context.id;
    }

    let data: ICollaborator[] = [];
    const logs = await CollaboratorModel.find({ params }).sort({ id: -1 });
    const phones = logs.map((c) => c.phone);
    const customers = await CustomerModel.find({ phone: { $in: phones } });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(SHEET_NAME);
    const excelHeaders = [STT, NAME, PHONE ,IS_COLLABORATOR,ADDRESS,GENDER ];
    sheet.addRow(excelHeaders);

    data.forEach((d: ICollaborator, i) => {
      const customer = customers.find(c=> c.phone === d.phone);
      const dataRow = [
        i + 1, 
        d.name, 
        d.phone, 
        customer ? "√" : "", 
        customer ? customer.address : "", 
        customer ? customer.gender === Gender.MALE ? "Nam"  : "Nữ" : ""
      ];
      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
  }
}

export default new CollaboratorRoute().router;

// const test = {
// };
