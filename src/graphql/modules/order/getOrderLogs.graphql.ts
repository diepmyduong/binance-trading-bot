import { gql } from "apollo-server-express";
import { Context } from "../../context";
import { OrderLogModel } from "../orderLog/orderLog.model";
import { IOrder } from "./order.model";

export default {
  schema: gql`
    extend type Order {
      logs: [OrderLog]
    }
  `,
  resolver: {
    Order: {
      logs: async (root: IOrder, args: any, context: Context) => {
        return OrderLogModel.find({ orderId: root._id });
      },
    },
  },
};
