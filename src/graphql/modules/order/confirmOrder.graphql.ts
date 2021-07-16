import { gql } from "apollo-server-express";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { onConfirmedOrder } from "../../../events/onConfirmedOrder.event";
import { Context } from "../../context";
import { OrderItemModel } from "../orderItem/orderItem.model";
import { OrderModel, OrderStatus } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      confirmOrder(orderId: ID!, note: String): Order
    }
  `,
  resolver: {
    Mutation: {
      confirmOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId, note } = args;
        const order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không tìm thấy đơn hàng");
        if (order.status != OrderStatus.PENDING) throw Error("Đơn hàng không hợp lệ");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        order.status = OrderStatus.CONFIRMED;
        order.confirmTime = new Date();
        order.confirmNote = note;
        await order.save();
        await OrderItemModel.updateMany(
          { orderId: order._id },
          { $set: { status: OrderStatus.CONFIRMED } }
        ).exec();
        onConfirmedOrder.next(order);
        return order;
      },
    },
  },
};
