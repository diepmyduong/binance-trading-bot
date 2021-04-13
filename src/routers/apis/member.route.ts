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
import { MemberModel, MemberType } from "../../graphql/modules/member/member.model";
import { ObjectId } from "mongodb";
import { ICommissionLog } from "../../graphql/modules/commissionLog/commissionLog.model";
import { AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";
import { BranchModel } from "../../graphql/modules/branch/branch.model";
import { isValidObjectId, Types } from "mongoose";
import { ErrorHelper } from "../../base/error";
import { ReportHelper } from "../../graphql/modules/report/report.helper";
import { get, isEmpty, keyBy, set } from "lodash";
import { OrderLogModel } from "../../graphql/modules/orderLog/orderLog.model";
import { MemberStatistics } from "../../graphql/modules/report/loaders/memberStatistics.loader";
import { CollaboratorModel } from "../../graphql/modules/collaborator/collaborator.model";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
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

const POST_FILE_NAME = "bao_cao_buu_cuc";


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

  async exportPortReport(req: Request, res: Response) {
    const context = (req as any).context as Context;
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);


    let fromDate: string = req.query.fromDate
      ? req.query.fromDate.toString()
      : null;
    let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
    const memberId: string = req.query.memberId
      ? req.query.memberId.toString()
      : "";

    if (!isEmpty(memberId)) {
      if (!isValidObjectId(memberId)) {
        throw ErrorHelper.requestDataInvalid("Mã bưu cục");
      }
    }

    const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

    const $match: any = {};
    const $memberMatch: any = { type: MemberType.BRANCH };

    if ($gte) {
      set($match, "createdAt.$gte", $gte);
    }

    if ($lte) {
      set($match, "createdAt.$lte", $lte);
    }


    if (memberId) {
      set($memberMatch, "_id", new ObjectId(memberId));
    }

    if (context.isMember()) {
      set($memberMatch, "_id", new ObjectId(memberId));
    }

    const members = await MemberModel.aggregate([
      {
        $match: {
          ...$memberMatch,
          activated: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branch'
        }
      },
      { $unwind: '$branch' },
      {
        $project: {
          _id: 1,
          code: 1,
          shopName: 1,
          district: 1,
          branchCode: "$branch.code",
          branchName: "$branch.name",
          lastLoginDate: 1
        }
      }
    ]);

    // console.log('members', members);

    const memberIds = members.map(member => member._id);

    let data: any = [];
    let staticsticData: any = [];
    const branchesData = [];


    const [orderStats, collaboratorsStats, branches] = await Promise.all([
      OrderLogModel.aggregate([
        {
          $match: {
            memberId: { $in: memberIds },
            ...$match
          }
        },
        {
          $group: {
            _id: "$orderId",
            memberId: { $first: "$memberId" },
            log: { $last: "$$ROOT" }
          }
        },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: '$order' },
        {
          $group: {
            _id: "$memberId",
            ordersCount: { $sum: 1 },
            pendingCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, 1, 0] } },
            confirmedCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, 1, 0] } },
            deliveringCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, 1, 0] } },
            canceledCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, 1, 0] } },
            failureCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, 1, 0] } },

            pendingAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, "$order.amount", 0] } },
            confirmedAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, "$order.amount", 0] } },
            deliveringAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, "$order.amount", 0] } },
            canceledAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, "$order.amount", 0] } },
            failureAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, "$order.amount", 0] } },
            estimatedIncome: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, "$order.amount"] } },
            income: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, "$order.amount", 0] } },

            pendingCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
            confirmedCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
            deliveringCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
            canceledCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
            failureCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
            estimatedCommission: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }] } },
            realCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
          }
        },
      ])
      , CollaboratorModel.aggregate([
        {
          $match: {
            memberId: { $in: memberIds },
            createdAt: {
              $lte
            },
          }
        },
        {
          $group: {
            _id: "$memberId",
            collaboratorsCount: { $sum: 1 },
            customersAsCollaboratorCount: { $sum: { $cond: [{ $ne: ["$customerId", undefined] }, 1, 0] } }
          }
        }
      ]),
      BranchModel.find({})
    ]);

    for (let i = 0; i < members.length; i++) {
      const member: any = members[i];
      const orderStat = orderStats.find(stats => stats._id.toString() === member._id.toString());
      const collaboratorStat = collaboratorsStats.find(stats => stats._id.toString() === member._id.toString());
      const customersCount = await CustomerModel.count({
        createdAt: {
          $lte
        },
        "pageAccounts": {
          $elemMatch: {
            memberId: member._id
          }
        }
      });
      // console.log('orderStat',orderStat);
      const params = {
        code: member.code,
        shopName: member.shopName,
        district: member.district,
        branchCode: member.branchCode,
        branchName: member.branchName,
        customersCount,
        collaboratorsCount: collaboratorStat ? collaboratorStat.collaboratorsCount : 0,
        customersAsCollaboratorCount: collaboratorStat ? collaboratorStat.customersAsCollaboratorCount : 0,
        ordersCount: orderStat ? orderStat.ordersCount : 0,
        pendingCount: orderStat ? orderStat.pendingCount : 0,
        confirmedCount: orderStat ? orderStat.confirmedCount : 0,
        deliveringCount: orderStat ? orderStat.deliveringCount : 0,
        completedCount: orderStat ? orderStat.completedCount : 0,
        failureCount: orderStat ? orderStat.failureCount : 0,
        canceledCount: orderStat ? orderStat.canceledCount : 0,
        estimatedCommission: orderStat ? orderStat.estimatedCommission : 0,
        realCommission: orderStat ? orderStat.realCommission : 0,
        estimatedIncome: orderStat ? orderStat.estimatedIncome : 0,
        income: orderStat ? orderStat.income : 0,
        lastLoginDate: member.lastLoginDate ? member.lastLoginDate : "Chưa đăng nhập"
      }

      // console.log('count', i);
      data.push(params);
    }

    const workbook = new Excel.Workbook();

    const createSheetData = (data: [], name: string) => {
      const sheet = workbook.addWorksheet(name);
      const excelHeaders = [
        STT,
        "Mã bưu cục",
        "Bưu cục",
        "Quận / Huyện",
        "Chi nhánh",
        "Số lượng Khách hàng",
        "Số lượng CTV",
        "Số lượng CTV - khách hàng",
        "Số lượng đơn hàng",
        "Đơn chờ",
        "Đơn xác nhận",
        "Đơn giao",
        "Đơn thành công",
        "Đơn thất bại",
        "Đơn đã huỷ",
        "Hoa hồng dự kiến",
        "Hoa hồng thực nhận",
        "Doanh thu dự kiến",
        "Doanh thu thực nhận",
        "Thời gian đăng nhập",
      ];
      sheet.addRow(excelHeaders);

      data.forEach((d: any, i: number) => {
        // console.log('d.customersAsCollaboratorCount',d.customersAsCollaboratorCount);
        const dataRow = [
          i + 1,//STT
          d.code,//"Mã bưu cục",
          d.shopName,// "Bưu cục",
          d.district,//"Quận / Huyện",
          d.branchName,//"Chi nhánh",
          d.customersCount,
          d.collaboratorsCount,
          d.customersAsCollaboratorCount,
          d.ordersCount, //
          d.pendingCount,
          d.confirmedCount,
          d.deliveringCount,
          d.completedCount,
          d.failureCount,
          d.canceledCount,
          d.estimatedCommission,
          d.realCommission,
          d.estimatedIncome,
          d.income,
          d.lastLoginDate
        ];
        sheet.addRow(dataRow);
      });

      UtilsHelper.setThemeExcelWorkBook(sheet);
    }

    const createStatisticSheetData = (data: [], name: string) => {
      const sheet = workbook.addWorksheet(name);
      const excelHeaders = [
        STT,
        "Bưu cục",
        "Số lượng Khách hàng",
        "Số lượng CTV",
        "Số lượng CTV - khách hàng",
        "Số lượng đơn hàng",
        "Đơn chờ",
        "Đơn xác nhận",
        "Đơn giao",
        "Đơn thành công",
        "Đơn thất bại",
        "Đơn đã huỷ",
        "Hoa hồng dự kiến",
        "Hoa hồng thực nhận",
        "Doanh thu dự kiến",
        "Doanh thu thực nhận",
      ];
      sheet.addRow(excelHeaders);

      data.forEach((d: any, i: number) => {
        const dataRow = [
          i + 1,
          d.name,
          d.customersCount,
          d.collaboratorsCount,
          d.customersAsCollaboratorCount,
          d.ordersCount,
          d.pendingCount,
          d.confirmedCount,
          d.deliveringCount,
          d.completedCount,
          d.failureCount,
          d.canceledCount,
          d.estimatedCommission,
          d.realCommission,
          d.estimatedIncome,
          d.income,
        ];
        sheet.addRow(dataRow);
      });

      UtilsHelper.setThemeExcelWorkBook(sheet);
    }
    
    const sumAllData = (name: string, data: any[]) => {
      return {
        name: name,
        customersAsCollaboratorCount: data.reduce((total: number, m: any) => total += m.customersAsCollaboratorCount, 0),
        ordersCount: data.reduce((total: number, m: any) => total += m.ordersCount, 0),
        pendingCount: data.reduce((total: number, m: any) => total += m.pendingCount, 0),
        confirmedCount: data.reduce((total: number, m: any) => total += m.confirmedCount, 0),
        deliveringCount: data.reduce((total: number, m: any) => total += m.deliveringCount, 0),
        completedCount: data.reduce((total: number, m: any) => total += m.completedCount, 0),
        failureCount: data.reduce((total: number, m: any) => total += m.failureCount, 0),
        canceledCount: data.reduce((total: number, m: any) => total += m.canceledCount, 0),
        estimatedCommission: data.reduce((total: number, m: any) => total += m.estimatedCommission, 0),
        realCommission: data.reduce((total: number, m: any) => total += m.realCommission, 0),
        estimatedIncome: data.reduce((total: number, m: any) => total += m.estimatedIncome, 0),
        income: data.reduce((total: number, m: any) => total += m.income, 0),
      }
    }


    const POSTS_SHEET_NAME = "Danh sách Bưu cục";
    createSheetData(data, POSTS_SHEET_NAME);


    if (!context.isMember() && isEmpty(memberId)) {
      for (const branch of branches) {
        const branchData = data.filter((m: any) => m.branchCode === branch.code);
        staticsticData.push(sumAllData(branch.name, branchData));
        branchesData.push({ name: branch.name, data: branchData });
      }
    }

    if (!context.isMember() && isEmpty(memberId)) {
      staticsticData.push(sumAllData("Tổng", data));
      createStatisticSheetData(staticsticData, "TH");

      for (const branchData of branchesData) {
        createSheetData(branchData.data, branchData.name);
      }
    }

    return UtilsHelper.responseExcel(res, workbook, POST_FILE_NAME);
  }
}

export default new MemberRoute().router;