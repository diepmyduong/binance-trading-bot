import { gql } from "apollo-server-express";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { onMemberDelivering } from "../../../events/onMemberDelivering.event";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      deliveryToMemberOrder(id: ID!): Order
    }
  `,
  resolver: {
    Mutation: {
      deliveryToMemberOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        const { id } = args;
        const order = await OrderModel.findById(id);
        if (!order || order.status != OrderStatus.CONFIRMED)
          throw Error("Đơn hàng không thể xác nhận");
        if (context.isMember() && order.toMemberId.toString() != context.id.toString())
          throw ErrorHelper.permissionDeny();
        order.status = OrderStatus.DELIVERING;
        await order.save();
        onMemberDelivering.next(order);
        return order;
      },
    },
  },
};
