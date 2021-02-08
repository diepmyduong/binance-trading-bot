import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";

import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { UtilsHelper } from "../../helpers";
import { AddressDeliveryImportingLogModel, IAddressDeliveryImportingLog } from "../../graphql/modules/addressDeliveryImportingLog/addressDeliveryImportingLog.model"

const STT = "STT";
const NAME = "Tên kho";
const PHONE = "Số điện thoại";
const EMAIL = "Email";
const ADDRESS = "Địa chỉ";
const PROVINCE = "Tỉnh/Thành";
const DISTRICT = "Quận/Huyện";
const WARD = "Phường/Xã";

class AddressDeliveryRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results", [auth], this.route(this.exportResultsToExcel));
    this.router.get("/export", [auth], this.route(this.exportToExcel));
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    let data: any[] = [];
    const logs = await AddressDeliveryImportingLogModel.find({}).sort({ line: 1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    const excelHeaders = [
      STT,
      NAME,
      PHONE,
      EMAIL,
      ADDRESS,
      PROVINCE,
      DISTRICT,
      WARD
    ]
    
    sheet.addRow(excelHeaders);

    data.forEach((d: IAddressDeliveryImportingLog, i) => {
      const dataRow = [
        d.no,
        d.name,
        d.phone,
        d.email,
        d.address,
        d.province,
        d.district,
        d.ward,
        d.success ? "Thành công" : "Lỗi",
        d.error
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, `ket_qua_import_kho_hang`);
  }

  async exportToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

  }

}


export default new AddressDeliveryRoute().router;
