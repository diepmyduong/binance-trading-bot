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


const STT = "STT";
const RESULT_IMPORT_FILE_NAME = "ket_qua_import_buu_cuc";
const SHEET_NAME = "Sheet1";


export const exportImportedMembersResultToExcel = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;
  context.auth(ROLES.ADMIN_EDITOR_MEMBER);

  // let data: any[] = [];
  // const logs = await CollaboratorImportingLogModel.find({}).sort({
  //   line: 1,
  // });

  // data = [...data, ...logs];

  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);
  // const excelHeaders = [STT, NAME, PHONE, RESULT, ERROR];

  // sheet.addRow(excelHeaders);

  // data.forEach((d: ICollaboratorImportingLog, i) => {
  //   const dataRow = [
  //     d.no,
  //     d.name,
  //     d.phone,
  //     d.success ? THANH_CONG : LOI,
  //     d.error,
  //   ];

  //   sheet.addRow(dataRow);
  // });

  return UtilsHelper.responseExcel(res, workbook, RESULT_IMPORT_FILE_NAME);
}