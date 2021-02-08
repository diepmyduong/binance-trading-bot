import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberHelper } from "../member/member.helper";
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
};

const CommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),

  note: async (root: ICommissionLog, args: any, context: Context) => {
    switch (root.type) {
      case CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER:
        return "Hoa hồng nhận từ đơn hàng dành cho Chủ shop";

      case CommissionLogType.RECEIVE_COMMISSION_1_FROM_REGI_SERVICE:
        return "Hoa hồng nhận từ dịch vụ đăng ký dành cho Chủ shop";

      case CommissionLogType.RECEIVE_COMMISSION_1_FROM_SMS:
        return "Hoa hồng nhận từ dịch vụ tin nhắn dành cho Chủ shop";

      case CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER:
        return "Hoa hồng nhận từ đơn hàng dành cho người giới thiệu Chủ shop";

      case CommissionLogType.RECEIVE_COMMISSION_2_FROM_REGI_SERVICE:
        return "Hoa hồng nhận từ dịch vụ đăng ký dành cho người giới thiệu Chủ shop";

      case CommissionLogType.RECEIVE_COMMISSION_2_FROM_SMS:
        return "Hoa hồng nhận từ dịch vụ tin nhắn dành cho người giới thiệu Chủ shop";
      default:
        return "";
    }
  },
};

export default {
  Query,
  CommissionLog,
};
