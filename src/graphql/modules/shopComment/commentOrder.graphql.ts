import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CustomerModel } from "../customer/customer.model";
import { OrderModel, OrderStatus } from "../order/order.model";
import { OrderCommentedLoader } from "./getOrderCommented.graphql";
import { ShopCommentModel } from "./shopComment.model";

export default {
  schema: gql`
    extend type Mutation {
      commentOrder(orderId: ID!, message: String!, rating: Int!, tags: [ShopTagInput]): String
    }
  `,
  resolver: {
    Mutation: {
      commentOrder: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.CUSTOMER]);
        const { orderId, message, rating, tags } = args;
        const oldComment = await ShopCommentModel.findOne({
          memberId: context.sellerId,
          customerId: context.id,
          orderId: orderId,
        });
        if (oldComment) return "Đã gửi đánh giá";
        const order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không có đơn hàng");
        if (order.status != OrderStatus.COMPLETED && order.status != OrderStatus.FAILURE)
          throw Error("Không thể đánh giá đơn hàng");
        if (order.buyerId.toString() != context.id) throw Error("Không thể đánh giá đơn hàng");
        const customer = await CustomerModel.findById(context.id);
        const newComment = await ShopCommentModel.create({
          memberId: context.sellerId,
          customerId: context.id,
          orderId: orderId,
          ownerName: customer.name || "Khách Vãng Lai",
          message: message,
          rating: rating,
          tags: tags,
        });
        OrderCommentedLoader.clear([newComment.orderId, newComment.customerId].join("."));
        return "Đã gửi đánh giá";
      },
    },
  },
};
