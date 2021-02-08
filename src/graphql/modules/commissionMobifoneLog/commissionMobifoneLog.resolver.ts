import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { CommissionMobifoneLogType, ICommissionMobifoneLog } from "./commissionMobifoneLog.model";
import { commissionMobifoneLogService } from "./commissionMobifoneLog.service";

const Query = {
  getAllCommissionMobifoneLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    return commissionMobifoneLogService.fetch(args.q);
  },
};

const CommissionMobifoneLog = {

  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),

  note: async (root: ICommissionMobifoneLog, args: any, context: Context) => {
    switch (root.type) {
      case CommissionMobifoneLogType.RECEIVE_COMMISSION_0_FROM_ORDER: //F0
        return "Hoa hồng nhận từ đơn hàng dành cho thành viên Mobiphone";
      case CommissionMobifoneLogType.RECEIVE_COMMISSION_0_FROM_REGI_SERVICE: //F0
        return "Hoa hồng nhận từ dịch vụ dành cho thành viên Mobiphone";
      case CommissionMobifoneLogType.RECEIVE_COMMISSION_0_FROM_SMS://F0
        return "Hoa hồng nhận từ dịch vụ tin nhắn dành cho thành viên Mobiphone";
      default:
        return "";
    }
  },
};
export default {
  Query,
  CommissionMobifoneLog,
};
