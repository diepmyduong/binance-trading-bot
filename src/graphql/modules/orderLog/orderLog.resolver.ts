import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderLoader, OrderStatus } from "../order/order.model";
import { orderLogService } from "./orderLog.service";
import { IOrderLog, OrderLogType } from "./orderLog.model";
import { MemberLoader, MemberModel } from "../member/member.model";
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
    const customer = await CustomerLoader.load(root.customerId);
    const member = await MemberLoader.load(root.memberId);
    const toMember = await MemberModel.findById(root.toMemberId);

    switch (root.type) {
      case OrderLogType.CREATED:
        return `Đơn hàng ${order.code} đang chờ xác nhận - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName}`;

      case OrderLogType.CONFIRMED:
        return `Đơn hàng ${order.code} đã được xác nhận nhận đơn - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName}`;

      case OrderLogType.MEMBER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng: ${customer.name} - bưu cục bán huỷ đơn: ${member?.shopName}`;

      case OrderLogType.CUSTOMER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng huỷ đơn: ${customer.name} - bưu cục bán: ${member?.shopName}`;

      case OrderLogType.MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName} - bưu cục giao: ${member?.shopName}`;

      case OrderLogType.TO_MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName} - bưu cục giao: ${toMember?.shopName}`;

      case OrderLogType.MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${customer.name} - bưu cục bán xác nhận: ${member?.shopName}`;

      case OrderLogType.TO_MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName} - bưu cục giao xác nhận: ${toMember?.shopName}`;

      case OrderLogType.MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${customer.name} - bưu cục bán xác nhận: ${member?.shopName}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName} - bưu cục giao xác nhận: ${toMember?.shopName}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${customer.name} - bưu cục bán: ${member?.shopName} - bưu cục giao xác nhận: ${toMember?.shopName}`;

      default:
        return "";
    }
  },

  statusText: async (root: IOrderLog, args: any, context: Context) => {
    switch (root.orderStatus) {
      case OrderStatus.PENDING:
        return `Đang xử lý`;
      case OrderStatus.CONFIRMED:
        return `Đã xác nhận`;
      case OrderStatus.DELIVERING:
        return `Đang giao hàng`;
      case OrderStatus.COMPLETED:
        return `Hoàn tất`;
      case OrderStatus.FAILURE:
        return `Thất bại`;
      case OrderStatus.CANCELED:
        return `Đã huỷ`;
      case OrderStatus.RETURNED:
        return `Đã hoàn hàng`;
      default:
        return root.orderStatus;
    }
  },
};

export default {
  Query,
  OrderLog,
};
