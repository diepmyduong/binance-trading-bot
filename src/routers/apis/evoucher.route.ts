import { BaseRoute, Request, Response, NextFunction } from "../../base/baseRoute";
import { ErrorHelper } from "../../base/error";
import { ROLES } from "../../constants/role.const";
import { Context } from "../../graphql/context";
import { UtilsHelper } from "../../helpers";
import { auth } from "../../middleware/auth";
import Excel from "exceljs";
import { ObjectId } from "mongodb";
import { EVoucherModel } from "../../graphql/modules/eVoucher/eVoucher.model";
import { EVoucherItemModel } from "../../graphql/modules/eVoucherItem/eVoucherItem.model";
import { EVoucherImportingLogModel } from "../../graphql/modules/eVoucherImportingLog/eVoucherImportingLog.model";

const STT = "STT";
const MA = "Mã";
const TEN = "Tên";
const THONG_TIN = "Thông tin";
const VOUCHER = "Mã voucher";
const THANH_CONG = "Thành công";
const LOI = "Lỗi";

class EVoucherRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/export-import-results", [auth], this.route(this.exportResultsToExcel));
    this.router.get("/export", [auth], this.route(this.exportEvoucher));
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    let data: any[] = [];
    const logs = await EVoucherImportingLogModel.find({}).sort({ _id: 1 });

    data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");
    const excelHeaders = [
      STT,
      MA,
      TEN,
      THONG_TIN,
      VOUCHER,
      THANH_CONG,
      LOI
    ]

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i) => {
      const dataRow = [
        i + 1,
        d.code,
        d.name,
        d.desc,
        d.voucher,
        d.success ? "Thành công" : "Lỗi",
        d.error
      ];

      sheet.addRow(dataRow);
    });

    UtilsHelper.setThemeExcelWorkBook(sheet);

    return UtilsHelper.responseExcel(res, workbook, `danh_sach_ket_qua_import_evoucher`);
  }

  async exportEvoucher(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR);

    const eVoucherId: string = req.query.evoucherid.toString();

    const eVoucher = await EVoucherModel.findById(eVoucherId);

    if (!eVoucher)
      throw ErrorHelper.mgQueryFailed("eVoucher");


    let data: any[] = [];

    const results = await EVoucherItemModel.aggregate([
      {
        $match: {
          eVoucherId: new ObjectId(eVoucher.id)
        }
      },
      {
        $lookup: {
          from: "evouchers",
          localField: "eVoucherId",
          foreignField: "_id",
          as: "evoucher"
        },
      },
      {
        $unwind: "$evoucher",
      },
      {
        $project: {
          _id: 1,
          evoucher: 1,
          activated: 1,
          code: 1,
          eVoucherId: 1,
          createdAt: 1,
          updatedAt: 1
        },
      },
    ]);

    data = [...data, ...results];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Danh sách Evoucher");
    const excelHeaders = [
      "STT",
      "Mã",
      "Tên",
      "Thông tin",
      "Mã voucher",
      "Tình trạng",
      "Ngày cập nhật",
    ]

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i) => {
      const dataRow = [
        i + 1,
        d.evoucher.code,
        d.evoucher.name,
        d.evoucher.desc,
        d.code,
        d.activated ? "Đã kích hoạt" : "Chưa kích hoạt",
        d.updatedAt
      ];

      sheet.addRow(dataRow);
    });
    
    UtilsHelper.setThemeExcelWorkBook(sheet);

    return UtilsHelper.responseExcel(res, workbook, `danh_sach_evoucher`);
  }
}


export default new EVoucherRoute().router;
