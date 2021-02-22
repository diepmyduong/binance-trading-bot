import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";

import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { UtilsHelper } from "../../helpers";
import { AddressStorehouseImportingLogModel, IAddressStorehouseImportingLog } from "../../graphql/modules/addressStorehouseImportingLog/addressStorehouseImportingLog.model"
import { IAddressStorehouse } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";

const STT = "STT";
const NAME = "Tên kho";
const PHONE = "Số điện thoại";
const EMAIL = "Email";
const ADDRESS = "Địa chỉ";
const PROVINCE = "Tỉnh/Thành";
const DISTRICT = "Quận/Huyện";
const WARD = "Phường/Xã";
const RESULT = "Kết quả";
const ERROR = "Lỗi";
const THANH_CONG = "Thành công"; 
const LOI = "Lỗi";
const RESULT_IMPORT_FILE_NAME = "ket_qua_import_kho_hang";
const RESULT_FILE_NAME = "danh_sach_kho_hang";
const SHEET_NAME = "Sheet1";

class AddressStorehouseRoute extends BaseRoute {
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
    const logs = await AddressStorehouseImportingLogModel.find({}).sort({ line: 1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(SHEET_NAME);
    const excelHeaders = [
      STT,
      NAME,
      PHONE,
      EMAIL,
      ADDRESS,
      PROVINCE,
      DISTRICT,
      WARD,
      RESULT,
      ERROR
    ]
    
    sheet.addRow(excelHeaders);

    data.forEach((d: IAddressStorehouseImportingLog, i) => {
      const dataRow = [
        d.no,
        d.name,
        d.phone,
        d.email,
        d.address,
        d.province,
        d.district,
        d.ward,
        d.success ? THANH_CONG : LOI,
        d.error
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_IMPORT_FILE_NAME);
  }

  async exportToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    let data: IAddressStorehouse[] = [];
    const logs = await AddressStorehouseModel.find({}).sort({ id: -1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(SHEET_NAME);
    const excelHeaders = [
      STT,
      NAME,
      PHONE,
      EMAIL,
      ADDRESS,
      PROVINCE,
      DISTRICT,
      WARD,
    ];
    sheet.addRow(excelHeaders);

    data.forEach((d:IAddressStorehouse, i) => {
      
      const dataRow = [
        i+1,
        d.name,
        d.phone,
        d.email,
        d.address,
        d.province,
        d.district,
        d.ward,
      ];

      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
  }

}


export default new AddressStorehouseRoute().router;
