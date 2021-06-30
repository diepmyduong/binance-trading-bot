import { gql } from "apollo-server-express";
import { Context } from "../../context";

export default {
  schema: gql`
    extend type Query {
      assignDeliveryMethod(orderId: string): Mixed
    }
  `,
  resolver: {
    Query: {
      assignDeliveryMethod: async (root: any, args: any, context: Context) => {},
    },
  },
};
