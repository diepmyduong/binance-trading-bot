import { gql } from "apollo-server-express";
import { Context } from "../../context";
import { CommissionLogModel } from "../commissionLog/commissionLog.model";
import { IOrder } from "./order.model";

export default {
  schema: gql`
    extend type Order {
      commissionLogs: [CommissionLog]
    }
  `,
  resolver: {
    Order: {
      commissionLogs: async (root: IOrder, args: any, context: Context) => {
        return CommissionLogModel.find({ orderId: root._id });
      },
    },
  },
};
