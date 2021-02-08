import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { IRegisSMSImportingLog, RegisSMSImportingLogModel } from "../../graphql/modules/regisSMSImportingLog/regisSMSImportingLog.model";

import Excel from "exceljs";
import { auth } from "../../middleware/auth";
import { UtilsHelper } from "../../helpers";

const STT = "STT";
const PHONE = "Số điện thoại";
const CODE = "Mã đăng ký SMS";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";

class SMSRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/register", [auth], this.route(this.index));
    this.router.get("/export-import-results", [auth], this.route(this.exportResultsToExcel));
  }

  async index(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth([ROLES.CUSTOMER]);
    const phone = req.query.phone;
    const body = req.query.body;

    if (!phone)
      throw ErrorHelper.mgRecoredNotFound("Số điện thoại");
    if (!body)
      throw ErrorHelper.mgRecoredNotFound("Tin nhắn");

    const isAndroid = !!req.headers["user-agent"].match(/Android/);
    const androidSMSSyntax = `sms:${phone}?body=${body}`
    const iosSMSSyntax = `sms:${phone}&body=${body}`
    const smsDeeplink = isAndroid ? androidSMSSyntax : iosSMSSyntax;
    res.redirect(smsDeeplink);
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    let data: any[] = [];
    const logs = await RegisSMSImportingLogModel.find({}).sort({ _id: 1 });

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


    data.forEach((d: IRegisSMSImportingLog, i) => {
      const dataRow = [
        i + 1,
        d.phone,
        d.code,
        d.success ? "Thành công" : "Lỗi",
        d.error
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, `ket_qua_import_duyet_dang_ky_sms`);
  }

}


export default new SMSRoute().router;
