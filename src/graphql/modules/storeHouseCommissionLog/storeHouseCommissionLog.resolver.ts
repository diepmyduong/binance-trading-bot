import { set } from "lodash";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberHelper } from "../member/member.helper";
import { OrderLoader, ShipMethod } from "../order/order.model";
import { storeHouseCommissionLogService } from "./storeHouseCommissionLog.service";
import { IStoreHouseCommissionLog } from "./storeHouseCommissionLog.model";
import { MemberLoader } from "../member/member.model";

const Query = {
  getAllStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const memberHelper = await MemberHelper.fromContext(context);
    if (memberHelper) {
      set(args, "q.filter.memberId", memberHelper.member._id);
    }
    return storeHouseCommissionLogService.fetch(args.q);
  },
  getOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await storeHouseCommissionLogService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await storeHouseCommissionLogService.deleteOne(id);
  },
};

const StoreHouseCommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),

  note: async (root: IStoreHouseCommissionLog, args: any, context: Context) => {
    const order = await OrderLoader.load(root.orderId);
    const member = await MemberLoader.load(order.sellerId);
    switch (order.shipMethod) {
      case ShipMethod.POST:
        return `Hoa hồng giao hàng dành cho bưu cục từ đơn hàng ${order.code} - khách hàng: ${order.buyerName} - Phương thức : Nhận hàng tại bưu cục`;

      case ShipMethod.VNPOST:
        return `Hoa hồng giao hàng dành cho bưu cục từ đơn hàng ${order.code} - khách hàng: ${order.buyerName} - Phương thức : Giao hàng tại địa chỉ`;

      default:
        return "";
    }
  },
};

export default {
  Query,
  Mutation,
  StoreHouseCommissionLog,
};
