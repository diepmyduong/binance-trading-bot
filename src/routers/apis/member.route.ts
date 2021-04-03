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
import { isValidObjectId } from "mongoose";
import { ErrorHelper } from "../../base/error";
import { ReportHelper } from "../../graphql/modules/report/report.helper";

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
      : null;

    if (!isValidObjectId(memberId)) {
      throw ErrorHelper.requestDataInvalid("Mã bưu cục");
    }

    let $gte: Date = null,
      $lte: Date = null;

    if (fromDate && toDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      toDate = toDate + "T24:00:00+07:00";
      $gte = new Date(fromDate);
      $lte = new Date(toDate);
    }

    const memberParams: any = { type: MemberType.BRANCH };

    if (memberId) {
      memberParams._id = new ObjectId(memberId);
    }

    if (context.isMember()) {
      memberParams._id = new ObjectId(context.id);
    }

    const [members, branches, addressDeliverys, addressStorehouses] = await Promise.all([
      MemberModel.find(memberParams),
      BranchModel.find(),
      AddressDeliveryModel.find(),
      AddressStorehouseModel.find()
    ]);

    let data: any = [];

    for (let i = 0; i < members.length; i++) {
      const member: any = members[i];

      const [
        customers,
        collaborators,
        customersAsCollaborator,
        allMemberCommission,
        orderStats
      ] = await Promise.all([
        ReportHelper.getCustomers(member, $gte, $lte),
        ReportHelper.getCollaborators(member, $gte, $lte),
        ReportHelper.getCustomersAsCollaborator(member, $gte, $lte),
        ReportHelper.getCommissionLogs(member, $gte, $lte),
        ReportHelper.getOrdersStats(member, $gte, $lte, addressDeliverys, addressStorehouses)
      ]);

      const customersCount = customers.length;
      const collaboratorsCount = collaborators.length;
      const customersAsCollaboratorCount = customersAsCollaborator.length;

      const { allIncomeStats, allCommissionStats } = orderStats;

      const branch = branches.find(br => br.id.toString() === member.branchId.toString());

      const totalCommission = allMemberCommission.reduce((total: number, log: ICommissionLog) => total += log.value, 0);

      const params = {
        code: member.code,
        shopName: member.shopName,
        address: member.address,
        ward: member.ward,
        district: member.district,
        province: member.province,
        branchCode: branch?.code,
        branchName: branch?.name,
        customersCount,
        collaboratorsCount,
        customersAsCollaboratorCount,
        ordersCount: allIncomeStats.allOrders.count,
        pendingCount: allIncomeStats.pendingOrders.count,
        confirmedCount: allIncomeStats.confirmedOrders.count,
        deliveringCount: allIncomeStats.deliveringOrders.count,
        completedCount: allIncomeStats.completedOrders.count,
        failureCount: allIncomeStats.failureOrders.count,
        canceledCount: allIncomeStats.canceledOrders.count,
        estimatedCommission: allCommissionStats.estimatedOrders.totalCommission,
        realCommission: totalCommission,
        estimatedIncome: allIncomeStats.estimatedOrders.sum,
        income: allIncomeStats.completedOrders.sum,
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
        "Địa chỉ",
        "Phường / Xã",
        "Quận / Huyện",
        "Tỉnh / Thành",
        "Chi nhánh",
        "Số lượng CTV",
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
          d.code,
          d.shopName,
          d.address,
          d.ward,
          d.district,
          d.province,
          d.branchName,
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
          d.totalIncome
        ];
        sheet.addRow(dataRow);
      });

      UtilsHelper.setThemeExcelWorkBook(sheet);
    }

    const POSTS_SHEET_NAME = "Danh sách Bưu cục";
    createSheetData(data, POSTS_SHEET_NAME);

    if (!context.isMember()) {
      const q10_q11 = ["Quận 10", "Quận 11"];
      const q10_q11_data = data.filter((m: any) => q10_q11.includes(m.district));
      createSheetData(q10_q11_data, q10_q11.join("-"));

      const q12_hocmon = ["Quận 12", "Hóc Môn"];
      const q12_hocmon_data = data.filter((m: any) => q12_hocmon.includes(m.district));
      createSheetData(q12_hocmon_data, q12_hocmon.join("-"));

      const gv_bt_pn = ["Gò Vấp", "Bình Thạnh", "Phú Nhuận"];
      const gv_bt_pn_data = data.filter((m: any) => gv_bt_pn.includes(m.district));
      createSheetData(gv_bt_pn_data, gv_bt_pn.join("-"));

      const tb_tp = ["Tân Bình", "Tân Phú"];
      const tb_tp_data = data.filter((m: any) => tb_tp.includes(m.district));
      createSheetData(tb_tp_data, tb_tp.join("-"));

      const q1_q2_q3 = ["Quận 1", "Quận 2", "Quận 3"];
      const q1_q2_q3_data = data.filter((m: any) => q1_q2_q3.includes(m.district));
      createSheetData(q1_q2_q3_data, q1_q2_q3.join("-"));

      const bt_bc = ["Bình Tân", "Bình Chánh"];
      const bt_bc_data = data.filter((m: any) => bt_bc.includes(m.district));
      createSheetData(bt_bc_data, bt_bc.join("-"));

      const q4_q7 = ["Quận 4", "Quận 7"];
      const q4_q7_data = data.filter((m: any) => q4_q7.includes(m.district));
      createSheetData(q4_q7_data, q4_q7.join("-"));

      const nb_cg = ["Nhà Bè", "Cần Giờ"];
      const nb_cg_data = data.filter((m: any) => nb_cg.includes(m.district));
      createSheetData(nb_cg_data, nb_cg.join("-"));

      const td_q9 = ["Thủ Đức", "Quận 9"];
      const td_q9_data = data.filter((m: any) => td_q9.includes(m.district));
      createSheetData(td_q9_data, td_q9.join("-"));

      const q5_q6_q8 = ["Quận 5", "Quận 6", "Quận 8"];
      const q5_q6_q8_data = data.filter((m: any) => q5_q6_q8.includes(m.district));
      createSheetData(q5_q6_q8_data, q5_q6_q8.join("-"));

      const cc = ["Củ Chi"];
      const cc_data = data.filter((m: any) => cc.includes(m.district));
      createSheetData(cc_data, cc[0]);
    }

    return UtilsHelper.responseExcel(res, workbook, POST_FILE_NAME);
  }
}

export default new MemberRoute().router;