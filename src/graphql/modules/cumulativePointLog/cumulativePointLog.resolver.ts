import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { CumulativePointLogType, ICumulativePointLog } from "./cumulativePointLog.model";
import { cumulativePointLogService } from "./cumulativePointLog.service";

const Query = {
  getAllCumulativePointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.tokenData.role == ROLES.MEMBER) {
      set(args, "q.filter.memberId", context.tokenData._id);
    }
    return cumulativePointLogService.fetch(args.q);
  },
};
const CumulativePointLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),

  note: async (root: ICumulativePointLog, args: any, context: Context) => {
    switch (root.type) {
      case CumulativePointLogType.RECEIVE_FROM_ORDER:
        return "Nhận từ đơn hàng";
      case CumulativePointLogType.RECEIVE_FROM_INVITE:
        return "Nhận từ mời thành viên";
      case CumulativePointLogType.RECEIVE_FROM_RESIS_SERVICE:
        return "Nhận từ đăng ký dịch vụ";
      case CumulativePointLogType.RECEIVE_FROM_REGIS_SMS:
        return "Nhận từ đăng ký SMS";
      default:
        return "";
    }
  },
};

export default {
  Query,
  CumulativePointLog,
};
