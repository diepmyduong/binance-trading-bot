import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../../graphql/context";
import Excel from "exceljs";
import { UtilsHelper } from "../../../helpers";
import {
  CollaboratorImportingLogModel,
  ICollaboratorImportingLog,
} from "../../../graphql/modules/collaboratorImportingLog/collaboratorImportingLog.model";


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


export const exportImportedCollaboratorsResultToExcel = async(req: Request, res: Response) => {
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

  UtilsHelper.setThemeExcelWorkBook(sheet);

  return UtilsHelper.responseExcel(res, workbook, RESULT_IMPORT_FILE_NAME);
}
