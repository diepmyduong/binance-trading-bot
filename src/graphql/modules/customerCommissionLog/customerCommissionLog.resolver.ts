import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import {
  ICustomerCommissionLog,
  CustomerCommissionLogType,
} from "./customerCommissionLog.model";
import { customerCommissionLogService } from "./customerCommissionLog.service";

const Query = {
  getAllCustomerCommissionLog: async (
    root: any,
    args: any,
    context: Context
  ) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    return customerCommissionLogService.fetch(args.q);
  },
};

const CustomerCommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),

  note: async (root: ICustomerCommissionLog, args: any, context: Context) => {
    switch (root.type) {
      case CustomerCommissionLogType.RECEIVE_FROM_ORDER:
        return "Nhận từ đơn hàng";
      case CustomerCommissionLogType.RECEIVE_FROM_INVITE:
        return "Nhận từ mời thành viên";
      case CustomerCommissionLogType.RECEIVE_FROM_RESIS_SERVICE:
        return "Nhận từ đăng ký dịch vụ";
      case CustomerCommissionLogType.RECEIVE_FROM_REGIS_SMS:
        return "Nhận từ đăng ký SMS";
      default:
        return "";
    }
  },
};

export default {
  Query,
  CustomerCommissionLog,
};
