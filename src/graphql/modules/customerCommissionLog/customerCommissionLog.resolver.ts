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
import { MemberLoader } from "../member/member.model";
import { set } from "lodash";
import { CustomerLoader } from "../customer/customer.model";
import { CustomerHelper } from "../customer/customer.helper";

const Query = {
  getAllCustomerCommissionLog: async (
    root: any,
    args: any,
    context: Context
  ) => {
    const customerHelper = await CustomerHelper.fromContext(context);
    if (customerHelper) {
      set(args, "q.filter.customerId", customerHelper.customer._id);
    }
    return customerCommissionLogService.fetch(args.q);
  },
};

const CustomerCommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),

  note: async (root: ICustomerCommissionLog, args: any, context: Context) => {

    const order = await OrderLoader.load(root.orderId);
    const member = await MemberLoader.load(order.sellerId);

    switch (root.type) {
      case CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER:
        return `Nhận từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      case CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_REGI_SERVICE:
        return "Nhận từ đăng ký dịch vụ";
      case CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_SMS:
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
