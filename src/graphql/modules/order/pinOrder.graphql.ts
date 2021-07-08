import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { OrderModel } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      pinOrder(orderId: ID!): Order
    }
  `,
  resolver: {
    Mutation: {
      pinOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId } = args;
        const order = await OrderModel.findById(orderId);
        order.pin = !order.pin;
        await order.save();
        return order;
      },
    },
  },
};
