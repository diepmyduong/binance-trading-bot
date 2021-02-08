import { BaseRoute, Request, Response } from "../../base/baseRoute";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { UtilsHelper } from "../../helpers";
import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { DiligencePointsImportingLogModel, IDiligencePointsImportingLog } from "../../graphql/modules/diligencePointsImportingLog/diligencePointsImportingLog.model";

const STT = "STT";
const EMAIL = "Email chủ shop";
const DIEM_SO = "Điểm số";
const GHI_CHU = "Ghi chú";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";

class DiligencePointRoute extends BaseRoute {
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
    const logs = await DiligencePointsImportingLogModel.find({}).sort({ _id: 1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    const excelHeaders = [
      STT,
      EMAIL,
      DIEM_SO,
      GHI_CHU,
      THANH_CONG,
      LOI
    ]

    sheet.addRow(excelHeaders);


    data.forEach((d: IDiligencePointsImportingLog, i) => {
      const dataRow = [
        i + 1,
        d.email,
        d.point,
        d.note,
        d.success ? "Thành công" : "Lỗi",
        d.error
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, `ket_qua_import_diem_chuyen_can`);
  }

}


export default new DiligencePointRoute().router;
