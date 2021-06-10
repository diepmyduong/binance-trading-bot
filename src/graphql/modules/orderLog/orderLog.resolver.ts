import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderLoader, OrderStatus } from "../order/order.model";
import { orderLogService } from "./orderLog.service";
import { IOrderLog, OrderLogType } from "./orderLog.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { CustomerLoader } from "../customer/customer.model";
import { get, set } from "lodash";

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
    const [order, customer, member, toMember] = await Promise.all([
      OrderLoader.load(root.orderId),
      CustomerLoader.load(root.customerId),
      MemberLoader.load(root.memberId),
      root.toMemberId ? MemberLoader.load(root.toMemberId) : null,
    ]);
    switch (root.type) {
      case OrderLogType.CREATED:
        return `Đơn hàng ${order.code} đang chờ xác nhận - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")}`;

      case OrderLogType.CONFIRMED:
        return `Đơn hàng ${order.code} đã được xác nhận nhận đơn - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")}`;

      case OrderLogType.TRANSFERED:
        return `Đơn hàng ${order.code} đã được chuyển kho - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao: ${get(toMember, "shopName")}`;

      case OrderLogType.MEMBER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng: ${
          customer.name
        } - bưu cục bán huỷ đơn: ${get(member, "shopName")}`;

      case OrderLogType.CUSTOMER_CANCELED:
        return `Đơn hàng ${order.code} đã bị huỷ - khách hàng huỷ đơn: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")}`;

      case OrderLogType.MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao: ${get(member, "shopName")}`;

      case OrderLogType.TO_MEMBER_DELIVERING:
        return `Đơn hàng ${order.code} đang giao - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao: ${get(toMember, "shopName")}`;

      case OrderLogType.MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${
          customer.name
        } - bưu cục bán xác nhận: ${get(member, "shopName")}`;

      case OrderLogType.TO_MEMBER_COMPLETED:
        return `Đơn hàng ${order.code} thành công - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao xác nhận: ${get(
          toMember,
          "shopName"
        )}`;

      case OrderLogType.MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${
          customer.name
        } - bưu cục bán xác nhận: ${get(member, "shopName")}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao xác nhận: ${get(
          toMember,
          "shopName"
        )}`;

      case OrderLogType.TO_MEMBER_FAILURE:
        return `Đơn hàng ${order.code} không thành công - khách hàng: ${
          customer.name
        } - bưu cục bán: ${get(member, "shopName")} - bưu cục giao xác nhận: ${get(
          toMember,
          "shopName"
        )}`;

      default:
        return "";
    }
  },

  statusText: async (root: IOrderLog, args: any, context: Context) => {
    switch (root.orderStatus) {
      case OrderStatus.PENDING:
        return `Chờ duyệt`;
      case OrderStatus.CONFIRMED:
        return `Xác nhận`;
      case OrderStatus.DELIVERING:
        return `Đang giao`;
      case OrderStatus.COMPLETED:
        return `Hoàn thành`;
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
