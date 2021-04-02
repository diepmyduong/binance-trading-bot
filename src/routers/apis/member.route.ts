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
import { Gender, IMember, MemberLoader, MemberModel, MemberType } from "../../graphql/modules/member/member.model";
import { CustomerCommissionLogModel } from "../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { ObjectId } from "mongodb";
import moment from "moment";
import { IOrder, OrderModel, OrderStatus, ShipMethod } from "../../graphql/modules/order/order.model";
import { CommissionLogModel } from "../../graphql/modules/commissionLog/commissionLog.model";
import { set } from "lodash";
import { MemberStatistics } from "../../graphql/modules/report/types/memberStatistics.type";
import { AddressDeliveryLoader, AddressDeliveryModel } from "../../graphql/modules/addressDelivery/addressDelivery.model";
import { AddressStorehouseModel } from "../../graphql/modules/addressStorehouse/addressStorehouse.model";

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
const POSTS_SHEET_NAME = "Danh sách Bưu cục";


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

    let data: any = [];

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

    const memberParams: any = { type: MemberType.BRANCH };

    if (memberId) {
      memberParams._id = new ObjectId(memberId);
    }

    const members = await MemberModel.find(memberParams);

    for (let i = 0; i < members.length; i++) {
      const member: any = members[i];

      const collaboratorsFromShop = await CustomerModel.aggregate([
        {
          $match: {
            "pageAccounts.memberId": new ObjectId(member.id)
          }
        },
        {
          $lookup: {
            from: "collaborators",
            localField: "_id",
            foreignField: "customerId",
            as: "collaborators",
          },
        },
        {
          ...($matchCollaboratorsFromShop(member))
        },
      ]);
      // console.log('collaboratorsFromShop', collaboratorsFromShop);

      const collaboratorsCount = collaboratorsFromShop.length;

      const [commissionFromLog] = await CommissionLogModel.aggregate([
        {
          ...($matchCommissionFromLog(member))
        },
        {
          $group: {
            _id: "$memberId",
            orderIds: { $addToSet: "$orderId" },
            total: {
              $sum: "$value",
            },
          }
        }
      ]);

      const realCommission = commissionFromLog ? commissionFromLog.total : 0;

      const { allStats } = await getOrdersStats(member, $gte, $lte);

      const params = {
        code: member.code,
        shopName: member.shopName,
        collaboratorsCount,
        ordersCount: allStats.allOrders.count,
        pendingCount: allStats.pendingOrders.count,
        confirmedCount: allStats.confirmedOrders.count,
        deliveringCount: allStats.deliveringOrders.count,
        completedCount: allStats.completedOrders.count,
        failureCount: allStats.failureOrders.count,
        canceledCount: allStats.canceledOrders.count,
        estimatedCommission: allStats.estimatedOrders.commissions.totalCommission,
        realCommission: realCommission,
        estimatedIncome: allStats.estimatedOrders.sum,
        income: allStats.completedOrders.sum
      }

      // console.log('count', i);
      data.push(params);
    }

    // console.log('data', data);

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(POSTS_SHEET_NAME);
    const excelHeaders = [
      STT,
      "Mã bưu cục",
      "Bưu cục",
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
        d.collaboratorsCount,
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
        d.income
      ];
      sheet.addRow(dataRow);
    });

    return UtilsHelper.responseExcel(res, workbook, POST_FILE_NAME);
  }

}

export default new MemberRoute().router;

const getOrdersStats = async (member: any, $gte: any, $lte: any) => {

  const orders = await OrderModel.aggregate([
    {
      $match: {
        sellerId: new ObjectId(member.id),
        createdAt: {
          $gte, $lte
        }
      }
    },
  ]);



  const allStats = await getAllStats(orders);
  // const noneStats = await getNoneOrderStats(orders);
  // const postStats = await getPostOrderStats(orders);
  // const vnportStats = await getVNPORTOrderStats(orders);

  // console.log('allStats', allStats);
  // console.log('noneStats', noneStats);
  // console.log('postStats', postStats);
  // console.log('vnportStats', vnportStats);

  return {
    allStats,
    // noneStats,
    // postStats,
    // vnportStats
  }
}
// nhan hang tai bc
const getAllStats = async (orders: IOrder[]) => {

  const allOrders = await getOrderStats(orders);
  const pendingOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.PENDING));
  const confirmedOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.CONFIRMED));
  const deliveringOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.DELIVERING));
  const estimatedOrders = await getOrderStats(orders.filter((o: IOrder) => [OrderStatus.DELIVERING, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(o.status)));
  const completedOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.COMPLETED));
  const failureOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.FAILURE));
  const canceledOrders = await getOrderStats(orders.filter((o: IOrder) => o.status === OrderStatus.CANCELED));

  return {
    allOrders,
    pendingOrders,
    confirmedOrders,
    deliveringOrders,
    estimatedOrders,
    completedOrders,
    failureOrders,
    canceledOrders,
  }
}


// nhan hang tai bc
const getNoneOrderStats = async (orders: IOrder[]) => {
  return await getAllStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.NONE));
}

// nhan hang tai bc
const getPostOrderStats = async (orders: IOrder[]) => {
  return await getAllStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.POST));
}

// giao hang tai dia chi
const getVNPORTOrderStats = async (orders: IOrder[]) => {
  return await getAllStats(orders.filter((o: IOrder) => o.shipMethod === ShipMethod.VNPOST));
}


const getOrderStats = async (orders: IOrder[]) => {
  const count = orders.length;
  const sum = count > 0 ? orders.reduce((total: number, o: IOrder) => total += o.amount, 0) : 0;
  const commissions = await getAllCommissionStats(orders);
  return {
    count,
    sum,
    commissions
  }
}

const getAllCommissionStats = async (orders: IOrder[]) => {
  const count = orders.length;
  const totalCommission1 = count > 0 ? getCommission1FromOrder(orders) : 0;
  const totalCommission2 = count > 0 ? getCommission2FromOrder(orders) : 0;
  const totalCommission3 = 0;
  // const totalCommission3 = count > 0 ? await getCommission3FromOrder(orders) : 0;
  const totalCommission = totalCommission1 + totalCommission2 + totalCommission3;
  return {
    totalCommission1,
    totalCommission2,
    totalCommission3,
    totalCommission
  }
}



const getCommission1FromOrder = (orders: IOrder[]) => {
  return orders.reduce((total: number, o: IOrder) => total += o.commission1, 0);
}

const getCommission2FromOrder = (orders: IOrder[]) => {
  const memberOrders: any = orders.filter((order: IOrder) => !order.collaboratorId);
  return memberOrders.reduce((total: number, o: IOrder) => total += o.commission2, 0);
}

const getCommission3FromOrder = async (orders: IOrder[]) => {
  const memberOrders: IOrder[] = [];

  for (const order of orders) {
    const member = await MemberLoader.load(order.sellerId);
    if (order.addressDeliveryId) {
      const addressDelivery = await AddressDeliveryLoader.load(order.addressDeliveryId);
      if (addressDelivery) {
        if (addressDelivery.code === member.code) {
          memberOrders.push(order);
        }
      }
    }
    if (order.addressStorehouseId) {
      const addressStorehouse = await AddressDeliveryLoader.load(order.addressStorehouseId);
      if (addressStorehouse) {
        if (addressStorehouse.code === member.code) {
          memberOrders.push(order);
        }
      }
    }
  }

  return memberOrders.reduce((total: number, o: IOrder) => total += o.commission3 ? o.commission3 : 0, 0);
}

// (async () => {
//   const currentTime = new Date();
//   let fromDate = `2021-03-01T00:00:00+07:00`; //2021-04-30
//   let toDate = moment(currentTime).format("YYYY-MM-DD") + "T23:59:59+07:00"; //2021-04-30
//   let $gte = new Date(fromDate);
//   let $lte = new Date(toDate);
//   const member = await MemberModel.findOne({ username: "test@gmail.com" })
//   await getOrdersStats(member, $gte, $lte);
// })();