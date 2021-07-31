import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberLoader } from "../member/member.model";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { CommissionLogType, ICommissionLog } from "./commissionLog.model";
import { commissionLogService } from "./commissionLog.service";

const Query = {
  getAllCommissionLog: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    set(args, "q.filter.memberId", context.sellerId);
    if (context.isCustomer()) {
      set(args, "q.filter.customerId", context.id);
    }
    return commissionLogService.fetch(args.q);
  },
};

const CommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),
  note: async (root: ICommissionLog, args: any, context: Context) => {
    const [order, member] = await Promise.all([
      OrderLoader.load(root.orderId),
      MemberLoader.load(root.memberId),
    ]);
    switch (root.type) {
      case CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER:
        return `Cửa hàng ${member.shopName} nhận hoa hồng điểm bán từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      // case CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_PRESENTER:
      //   return `Hoa hồng giới thiệu cho chủ shop giới thiệu từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      case CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR:
        return `Cửa hàng ${member.shopName} nhận hoa hồng cộng tác viên từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      case CommissionLogType.RECEIVE_COMMISSION_3_FROM_ORDER:
        return `Cửa hàng ${member.shopName} nhận hoa hồng kho từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      case CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER:
        return `Nhận hoa hồng giới thiệu từ ĐH[${order.code}] - KH[${order.buyerName}]`;
      default:
        return "";
    }
  },
};

export default {
  Query,
  CommissionLog,
};
