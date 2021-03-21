import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderLoader } from "../order/order.model";
import { orderLogService } from "./orderLog.service";
import { IOrderLog, OrderLogType } from "./orderLog.model";
import { MemberLoader } from "../member/member.model";
import { CustomerLoader } from "../customer/customer.model";
import { set } from "lodash";

const Query = {
  getAllOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      set(args, "q.filter.memberId", context.id);
    }
    return orderLogService.fetch(args.q);
  },
  getAllToMemberOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      set(args, "q.filter.toMemberId", context.id);
    }
    return orderLogService.fetch(args.q);
  },
  getOneOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    return await orderLogService.findOne({ _id: id });
  },
};


// orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
// type: { type: String, enum: Object.values(OrderLogType), required: true },
// memberId: {type: Schema.Types.ObjectId, ref:"Member", required: true},
// toMemberId: {type: Schema.Types.ObjectId, ref:"Member"},
// customerId: { type: Schema.Types.ObjectId, ref: "Customer" },

const OrderLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  toMember: GraphQLHelper.loadById(MemberLoader, "toMemberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),

  note: async (root: IOrderLog, args: any, context: Context) => {
    const order = await OrderLoader.load(root.orderId);
    const member = await MemberLoader.load(order.sellerId);
    const toMember = await MemberLoader.load(order.toMemberId);
    switch (root.type) {
      case OrderLogType.CREATED:
        return `Đơn hàng ${order.code} đang chờ xác nhận - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName}`;

      case OrderLogType.CONFIRMED:
        return `Đơn hàng ${order.code} đã được xác nhận nhận đơn - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName}`;

      case OrderLogType.MEMBER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng: ${order.buyerName} - bưu cục bán huỷ đơn: ${member.shopName}`;

      case OrderLogType.CUSTOMER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng huỷ đơn: ${order.buyerName} - bưu cục bán: ${member.shopName}`;

      case OrderLogType.MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName} - bưu cục giao: ${member.shopName}`;

      case OrderLogType.TO_MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName} - bưu cục giao: ${toMember.shopName}`;

      case OrderLogType.MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${order.buyerName} - bưu cục bán xác nhận: ${member.shopName}`;

      case OrderLogType.TO_MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName} - bưu cục giao xác nhận: ${toMember.shopName}`;

      case OrderLogType.MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${order.buyerName} - bưu cục bán xác nhận: ${member.shopName}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName} - bưu cục giao xác nhận: ${toMember.shopName}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${order.buyerName} - bưu cục bán: ${member.shopName} - bưu cục giao xác nhận: ${toMember.shopName}`;

      default:
        return "";
    }
  },
};

export default {
  Query,
  OrderLog,
};
