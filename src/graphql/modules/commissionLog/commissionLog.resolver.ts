import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberHelper } from "../member/member.helper";
import { MemberLoader } from "../member/member.model";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { CommissionLogType, ICommissionLog } from "./commissionLog.model";
import { commissionLogService } from "./commissionLog.service";

const Query = {
  getAllCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const memberHelper = await MemberHelper.fromContext(context);
    if (memberHelper) {
      set(args, "q.filter.memberId", memberHelper.member._id);
    }
    return commissionLogService.fetch(args.q);
  },
  // getCommissionTypes :
};

const CommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),
  // commissionType : async (root: ICommissionLog, args: any, context: Context) => {
  //   switch (root.type) {
  //     case CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER:
  //       return `HH Điểm bán`;

  //     case CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR:
  //       return `HH cộng tác viên`;

  //     case CommissionLogType.RECEIVE_COMMISSION_3_FROM_ORDER:
  //       return `HH giao hàng`;

  //     default:
  //       return "";
  //   }
  // },
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

      default:
        return "";
    }
  },
};

export default {
  Query,
  CommissionLog,
};
