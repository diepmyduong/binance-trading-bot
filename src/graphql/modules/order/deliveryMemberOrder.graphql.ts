import { gql } from "apollo-server-express";

import { ROLES } from "../../../constants/role.const";
import { onMemberDelivering } from "../../../events/onMemberDelivering.event";
import { ErrorHelper } from "../../../helpers";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { Context } from "../../context";
import { OrderModel, OrderStatus, ShipMethod } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      deliveryMemberOrder(orderId: ID!): Order
    }
  `,
  resolver: {
    Mutation: {
      deliveryMemberOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId } = args;
        const order = await OrderModel.findById(orderId);
        if (!order || order.status != OrderStatus.CONFIRMED) throw Error("Đơn hàng không thể giao");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        order.status = OrderStatus.DELIVERING;
        if (order.shipMethod == ShipMethod.DRIVER) {
          order.deliveryInfo.status = "IN PROCESS";
          order.deliveryInfo.statusText = Ahamove.StatusText["IN PROCESS"];
        }
        await order.save();
        onMemberDelivering.next(order);
        return order;
      },
    },
  },
};
