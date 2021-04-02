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
import { Gender, MemberModel } from "../../graphql/modules/member/member.model";
import { CustomerCommissionLogModel } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { ObjectId } from "mongodb";

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
    this.router.get(
      "/exportCollaboratorsReport",
      [auth],
      this.route(this.exportCollaboratorsReport)
    );
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
    const excelHeaders = [STT, NAME, PHONE, IS_COLLABORATOR, ADDRESS, GENDER];
    sheet.addRow(excelHeaders);

    data.forEach((d: ICollaborator, i) => {
      const customer = customers.find((c) => c.phone === d.phone);
      const dataRow = [
        i + 1,
        d.name,
        d.phone,
        customer ? "√" : "",
        customer ? customer.address : "",
        customer ? (customer.gender === Gender.MALE ? "Nam" : "Nữ") : "",
      ];
      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
  }

  async exportCollaboratorsReport(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    let fromDate: string = req.query.fromDate
      ? req.query.fromDate.toString()
      : null;
    let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
    const memberId: string = req.query.memberId
      ? req.query.memberId.toString()
      : null;

    let data: any = [];

    let $gte = null,
      $lte = null;

    const $match: any = {};

    if (fromDate && toDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      toDate = toDate + "T24:00:00+07:00";
      $gte = new Date(fromDate);
      $lte = new Date(toDate);
      $match.createdAt = { $gte, $lte };
    }

    if (memberId) {
      $match.memberId = new ObjectId(memberId);
    }

    //customerId:ObjectId("603b6ea20c5de11eaca05606"),

    // console.log("$match", $match);

    let result = await CustomerCommissionLogModel.aggregate([
      {
        $project: {
          _id: 1,
          customerId: 1,
          memberId: 1,
          type: 1,
          value: 1,
          orderId: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $match,
      },
      {
        $group: {
          _id: "$customerId",
          memberIds: { $addToSet: "$memberId" },
          customerIds: { $addToSet: "$customerId" },
          total: {
            $sum: "$value",
          },
        },
      },
      {
        $project: {
          _id: 0,
          memberIds: 1,
          customerId: { $arrayElemAt: ["$customerIds", 0] },
          createdAt:1,
          total: 1,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $project: {
          _id: 1,
          customerId: 1,
          customer: { $arrayElemAt: ["$customer", 0] },
          memberIds: 1,
          createdAt:1,
          total: 1,
        },
      },
    ]);

    const members = await MemberModel.find({});

    data = [...data, ...result];

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(SHEET_NAME);
    const excelHeaders = [STT, NAME, PHONE, "Bưu cục", "Hoa hồng", "Ngày phát sinh"];
    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,
        d.customer.name,
        d.customer.phone,
        members
          .filter((m) =>
            d.memberIds.map((id: any) => id.toString()).includes(m.id)
          )
          .map((m) => m.shopName)
          .join("\n"),
        d.total,
        d.createdAt,
      ];
      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
  }
}

export default new CollaboratorRoute().router;

// const test = {
// };
