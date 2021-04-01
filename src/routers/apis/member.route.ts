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
import moment from "moment";
import { OrderStatus } from "../../graphql/modules/order/order.model";

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
class MemberRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get(
      "/export-import-results",
      [auth],
      this.route(this.exportResultsToExcel)
    );
    this.router.get(
      "/exportPortReport",
      [auth],
      this.route(this.exportPortReport)
    );
  }

  async exportResultsToExcel(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    // let data: any[] = [];
    // const logs = await CollaboratorImportingLogModel.find({}).sort({
    //   line: 1,
    // });

    // data = [...data, ...logs];

    const workbook = new Excel.Workbook();
    // const sheet = workbook.addWorksheet(SHEET_NAME);
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

  async exportPortReport(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);

    let fromDate: string = req.query.fromDate
      ? req.query.fromDate.toString()
      : null;
    let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
    const memberId: string = req.query.memberId
      ? req.query.memberId.toString()
      : null;


    let $gte: Date = null,
      $lte: Date = null;

    const currentMonth = moment().month() + 1;

    if (fromDate && toDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      toDate = toDate + "T24:00:00+07:00";
      $gte = new Date(fromDate);
      $lte = new Date(toDate);
    }
    else {
      const currentTime = new Date();
      fromDate = `2021-${currentMonth}-01T00:00:00+07:00`; //2021-04-30
      toDate = moment(currentTime).format("YYYY-MM-DD") + "T23:59:59+07:00"; //2021-04-30
      $gte = new Date(fromDate);
      $lte = new Date(toDate);
    }

    const $matchIncomeFromOrder = (member: any) => {
      const match: any = {
        $match: {
          sellerId: new ObjectId(member.id),
          status: OrderStatus.COMPLETED,
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    };

    const $matchCollaboratorsFromShop = (member: any) => {
      const match: any = {
        $match: {
          "collaborators.memberId": new ObjectId(member.id),
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    };

    const $matchCommissionFromLog = (member: any) => {
      const match: any = {
        $match: {
          memberId: new ObjectId(member.id),
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    };

    const $matchEstimatedCommission1ByOrder = (member: any) => {
      const match: any = {
        $match: {
          sellerId: new ObjectId(member.id),
          status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    }

    const $matchEstimatedCommission2ByOrder = (member: any) => {
      const match: any = {
        $match: {
          sellerId: new ObjectId(member.id),
          status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
          collaboratorId: { $exists: false },
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    }

    const $matchEstimatedCommission3ByReceivingOrder = (member: any) => {
      const match: any = {
        $match: {
          sellerId: new ObjectId(member.id),
          status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
          addressDeliveryId: { $exists: true },
          commission3: { $gt: 0 },
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    }


    const $matchEstimatedCommission3ByDeliveringOrder = (member: any) => {
      const match: any = {
        $match: {
          sellerId: new ObjectId(member.id),
          status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING] },
          addressStorehouseId: { $exists: true },
          commission3: { $gt: 0 },
          createdAt: {
            $gte, $lte
          }
        }
      };
      return match;
    }

    const members = await MemberModel.find({});

    // data = [...data, ...result];

    const workbook = new Excel.Workbook();
    // const sheet = workbook.addWorksheet(SHEET_NAME);
    // const excelHeaders = [STT, NAME, PHONE, "Bưu cục", "Hoa hồng"];
    // sheet.addRow(excelHeaders);

    // data.forEach((d: any, i: number) => {
    //   const dataRow = [
    //     i + 1,
    //     d.customer.name,
    //     d.customer.phone,
    //     members
    //       .filter((m) =>
    //         d.memberIds.map((id: any) => id.toString()).includes(m.id)
    //       )
    //       .map((m) => m.shopName)
    //       .join("\n"),
    //     d.total,
    //   ];
    //   sheet.addRow(dataRow);
    // });

    return UtilsHelper.responseExcel(res, workbook, RESULT_FILE_NAME);
  }
}

export default new MemberRoute().router;

// const test = {
// };
