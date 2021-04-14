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
import { MemberModel, MemberType } from "../../../graphql/modules/member/member.model";
import { ObjectId } from "mongodb";
import { CommissionLogModel, CommissionLogType, ICommissionLog } from "../../../graphql/modules/commissionLog/commissionLog.model";
import { BranchModel } from "../../../graphql/modules/branch/branch.model";
import { isValidObjectId, Types } from "mongoose";
import { ErrorHelper } from "../../../base/error";
import { get, isEmpty, set } from "lodash";
import { OrderLogModel } from "../../../graphql/modules/orderLog/orderLog.model";
import { CollaboratorModel } from "../../../graphql/modules/collaborator/collaborator.model";
import { CustomerModel } from "../../../graphql/modules/customer/customer.model";
import moment from "moment";

const STT = "STT";
const RESULT_IMPORT_FILE_NAME = "ket_qua_import_buu_cuc";
const SHEET_NAME = "Sheet1";

export const  exportPortCommissionReport = async(req: Request, res: Response) => {
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
  const $memberMatch: any = { type: MemberType.BRANCH, activated: true };

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

  const memberIds = members.map(member => member._id).map(Types.ObjectId);
  set($match, "memberId.$in", memberIds);

  const [orderCommissionStats, branches] = await Promise.all([
    CommissionLogModel.aggregate([
      {
        $match
      },
      {
        $group: {
          _id: "$memberId",
          commission1: { $sum: { $cond: [{ $eq: ["$type", CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER] }, "$value", 0] } },
          commission2: { $sum: { $cond: [{ $eq: ["$type", CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR] }, "$value", 0] } },
          commission3: { $sum: { $cond: [{ $eq: ["$type", CommissionLogType.RECEIVE_COMMISSION_3_FROM_ORDER] }, "$value", 0] } },
          commission: { $sum: "$value" },
        }
      }
    ]),
    BranchModel.find({})
  ]);

  // console.log('orderStats',orderCommissionStats);

  let data: any = [];
  let staticsticData: any = [];
  const branchesData = [];

  for (let i = 0; i < members.length; i++) {
    const member: any = members[i];
    const orderCommissionStat = orderCommissionStats.find(stats => stats._id.toString() === member._id.toString());
    const params = {
      code: member.code,
      shopName: member.shopName,
      district: member.district,
      branchCode: member.branchCode,
      branchName: member.branchName,
      commission1 : orderCommissionStat ? orderCommissionStat.commission1 : 0,
      commission2: orderCommissionStat ? orderCommissionStat.commission2 : 0,
      commission3: orderCommissionStat ? orderCommissionStat.commission3 : 0,
      commission: orderCommissionStat ? orderCommissionStat.commission : 0,
    }
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
      "Hoa hồng điểm bán",
      "Hoa hồng CTV",
      "Hoa hồng giao hàng",
      "Hoa hồng thực nhận",
    ];

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,//STT
        d.code,//"Mã bưu cục",
        d.shopName,// "Bưu cục",
        d.district,//"Quận / Huyện",
        d.branchName,//"Chi nhánh",
        d.commission1,
        d.commission2,
        d.commission3,
        d.commission,
      ];
      sheet.addRow(dataRow);
    });
    UtilsHelper.setThemeExcelWorkBook(sheet);

    const vnFromDate = moment(fromDate).format("DD-MM-YYYY");
    const vnToDate = moment(toDate).format("DD-MM-YYYY");
    const title = `BÁO CÁO HOA HỒNG BƯU CỤC ${vnFromDate} - ${vnToDate}`;
    UtilsHelper.setTitleExcelWorkBook(sheet, title);
  }


  const createStatisticSheetData = (data: [], name: string) => {
    const sheet = workbook.addWorksheet(name);
    const excelHeaders = [
      STT,
      "Khu vực",
      "Hoa hồng thực nhận"
    ];
    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,
        d.name,
        d.commission
      ];
      sheet.addRow(dataRow);
    });

    UtilsHelper.setThemeExcelWorkBook(sheet);

    const vnFromDate = moment(fromDate).format("DD-MM-YYYY");
    const vnToDate = moment(toDate).format("DD-MM-YYYY");
    const title = `BÁO CÁO TỔNG QUAN HOA HỒNG CÁC KHU VỰC ${vnFromDate} - ${vnToDate}`;
    UtilsHelper.setTitleExcelWorkBook(sheet, title);
  }

  const sumAllData = (name: string, data: any[]) => {
    return {
      name: name,
      customersAsCollaboratorCount: data.reduce((total: number, m: any) => total += m.customersAsCollaboratorCount, 0),
      commission1: data.reduce((total: number, m: any) => total += m.commission1, 0),
      commission2: data.reduce((total: number, m: any) => total += m.commission2, 0),
      commission3: data.reduce((total: number, m: any) => total += m.commission3, 0),
      commission: data.reduce((total: number, m: any) => total += m.commission, 0),
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

  const vnFromDate = moment(fromDate).format("DD.MM.YYYY");
  const vnToDate = moment(toDate).format("DD.MM.YYYY");
  const fileName = `bao_cao_hoa_hong_buu_cuc_${vnFromDate}_${vnToDate}`;
  return UtilsHelper.responseExcel(res, workbook, fileName);
}



