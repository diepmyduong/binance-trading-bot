import { gql } from "apollo-server-express";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { onConfirmedOrder } from "../../../events/onConfirmedOrder.event";
import { onTransfering } from "../../../events/onTransfering.event";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { OrderItemModel } from "../orderItem/orderItem.model";
import { OrderModel, OrderStatus } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      transferOrder(id: ID!, memberId: ID!, note: String): Order
    }
  `,
  resolver: {
    Mutation: {
      transferOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        const { id, note, memberId } = args;
        const order = await OrderModel.findById(id);
        if (order.status != OrderStatus.PENDING) throw Error("Đơn hàng không thể chuyển kho.");
        if (context.isMember() && order.sellerId.toString() != context.id.toString())
          throw ErrorHelper.permissionDeny();
        const member = await MemberModel.findById(memberId);
        if (!member) throw Error("Bưu cục không hợp lệ");
        order.toMemberId = member.id;
        order.status = OrderStatus.CONFIRMED;
        order.toMemberNote = note;
        await order.save();
        await OrderItemModel.updateMany(
          { orderId: order._id },
          { $set: { status: OrderStatus.CONFIRMED } }
        ).exec();
        onTransfering.next(order);
        onConfirmedOrder.next(order);
        return order;
      },
    },
  },
};
