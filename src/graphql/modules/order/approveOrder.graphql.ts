import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { onApprovedCompletedOrder } from "../../../events/onApprovedCompletedOrder.event";
import { onApprovedFailureOrder } from "../../../events/onApprovedFailureOrder.event";
import { ErrorHelper } from "../../../helpers";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { Context } from "../../context";
import { OrderItemModel } from "../orderItem/orderItem.model";
import { OrderModel, OrderStatus, PickupMethod, ShipMethod } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      approveOrder(orderId: ID!, status: String!, note: String): Order
    }
  `,
  resolver: {
    Mutation: {
      approveOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId, note, status } = args;
        const order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không tìm thấy đơn hàng");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        switch (order.pickupMethod) {
          case PickupMethod.DELIVERY: {
            if (order.status != OrderStatus.DELIVERING)
              throw Error("Không thể xác nhận đơn này. " + order.deliveryInfo.statusText);
            order.status = status;
            if (order.shipMethod == ShipMethod.DRIVER) {
              if (order.status === OrderStatus.COMPLETED) {
                order.deliveryInfo.status = "COMPLETED";
                order.deliveryInfo.statusText = Ahamove.StatusText.COMPLETED;
              }
              if (order.status === OrderStatus.FAILURE) {
                order.deliveryInfo.status = "COMPLETED";
                order.deliveryInfo.statusText = "Giao hàng không thành công.";
              }
              order.markModified("deliveryInfo");
            }
          }
          case PickupMethod.STORE: {
            order.status = status;
          }
        }
        order.note = note;
        await order.save();
        await OrderItemModel.updateMany(
          { orderId: order._id },
          { $set: { status: order.status } }
        ).exec();
        if (order.status === OrderStatus.COMPLETED) {
          onApprovedCompletedOrder.next(order);
        }
        if (order.status === OrderStatus.FAILURE) {
          onApprovedFailureOrder.next(order);
        }
        return order;
      },
    },
  },
};
