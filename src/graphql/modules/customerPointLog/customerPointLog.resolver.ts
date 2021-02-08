import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerHelper } from "../customer/customer.helper";
import { LuckyWheelResultLoader } from "../luckyWheelResult/luckyWheelResult.model";
import { MemberHelper } from "../member/member.helper";
import { OrderLoader } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import { ICustomerPointLog, CustomerPointLogType } from "./customerPointLog.model";
import { customerPointLogService } from "./customerPointLog.service";

const Query = {
  getAllCustomerPointLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const customerHelper = await CustomerHelper.fromContext(context);
    if (customerHelper) {
      set(args, "q.filter.customerId", customerHelper.customer._id);
    }
    return customerPointLogService.fetch(args.q);
  },
};

const CustomerPointLog = {
  note: async (root: ICustomerPointLog, args: any, context: Context) => {
    switch (root.type) {
      case CustomerPointLogType.RECEIVE_FROM_ORDER:
        return "Nhận từ đơn hàng";
      case CustomerPointLogType.RECEIVE_FROM_INVITE:
        return "Nhận từ mời thành viên";
      case CustomerPointLogType.RECEIVE_FROM_RESIS_SERVICE:
        return "Nhận từ đăng ký dịch vụ";
      case CustomerPointLogType.RECEIVE_FROM_REGIS_SMS:
        return "Nhận từ đăng ký SMS";
      case CustomerPointLogType.RECEIVE_FROM_LUCKY_WHEEL:
        return "Nhận từ trúng thưởng vòng quay may mắn";
      case CustomerPointLogType.PAY_TO_PLAY_LUCKY_WHEEL:
        return "Trả điểm quay vòng quay may mắn";
      default:
        return "";
    }
  },
  // orderId: string; // Mã đơn hàng
  // regisSMSId: string; // Mã đăng ký SMS
  // regisServiceId: string; //Mã đăng ký dịch vụ
  // luckyWheelResultId: string //Mã lịch sử quay vòng quay may mắn

  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),
  luckyWheelResult: GraphQLHelper.loadById(LuckyWheelResultLoader, "luckyWheelResultId"),
};

export default {
  Query,
  CustomerPointLog,
};
