import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { Context } from "../../context";
import { IOrderLog, OrderLogModel } from "../orderLog/orderLog.model";
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
        return loader.load(root._id.toString());
      },
    },
  },
};

const loader = new DataLoader<string, IOrderLog>(
  async (ids: string[]) => {
    return await OrderLogModel.aggregate([
      { $match: { orderId: { $in: ids.map(Types.ObjectId) } } },
      { $group: { _id: "$orderId", logs: { $push: "$$ROOT" } } },
    ]).then((list) => {
      const listKeyBy = keyBy(list, "_id");
      return ids.map((id) =>
        get(listKeyBy, `${id}.logs`, []).map((o: any) => new OrderLogModel(o))
      );
    });
  },
  { cache: false } // Bỏ cache
);
