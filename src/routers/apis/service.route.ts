import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";

import Excel from "exceljs";
import { auth } from "../../middleware/auth";
import { UtilsHelper } from "../../helpers";
import { IRegisServiceImportingLog, RegisServiceImportingLogModel } from "../../graphql/modules/regisServiceImportingLog/regisServiceImportingLog.model";

const STT = "STT";
const PHONE = "Số điện thoại";
const CODE = "Mã đăng ký dịch vụ";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";

class ServiceRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results", [auth], this.route(this.exportResultsToExcel));
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    let data: any[] = [];
    const logs = await RegisServiceImportingLogModel.find({}).sort({ _id: 1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    const excelHeaders = [
      STT,
      PHONE,
      CODE,
      THANH_CONG,
      LOI
    ]

    sheet.addRow(excelHeaders);


    data.forEach((d: IRegisServiceImportingLog, i) => {
      const dataRow = [
        i + 1,
        d.phone,
        d.code,
        d.success ? "Thành công" : "Lỗi",
        d.error
      ];

      sheet.addRow(dataRow);
    });

    UtilsHelper.setThemeExcelWorkBook(sheet);

    return UtilsHelper.responseExcel(res, workbook, `ket_qua_import_duyet_dang_ky_dich_vu`);
  }

}


export default new ServiceRoute().router;
