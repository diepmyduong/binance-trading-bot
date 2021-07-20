import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";
import { IDriver } from "./driver.model";

export default {
  schema: gql`
    extend type Driver {
      orderStats: DriverOrderStats
    }
    type DriverOrderStats {
      shipfee: Float
      total: Int
      completed: Int
      failure: Int
    }
  `,
  resolver: {
    Driver: {
      orderStats: async (root: IDriver, args: any, context: Context) => {
        return await DriverOrderStatsLoader.load(root._id.toString());
      },
    },
  },
};

export const DriverOrderStatsLoader = new DataLoader<string, any>(
  (ids: string[]) => {
    const objectIds = ids.map(Types.ObjectId);
    return OrderModel.aggregate([
      { $match: { driverId: { $in: objectIds } } },
      {
        $group: {
          _id: "$driverId",
          completed: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, 1, 0] } },
          failure: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.FAILURE] }, 1, 0] } },
          total: { $sum: 1 },
          shipfee: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    [OrderStatus.FAILURE, OrderStatus.COMPLETED, OrderStatus.DELIVERING],
                  ],
                },
                "$deliveryInfo.partnerFee",
                0,
              ],
            },
          },
        },
      },
    ]).then((list) => {
      const keyById = keyBy(list, "_id");
      return ids.map((id) =>
        get(keyById, id, {
          shipfee: 0,
          total: 0,
          completed: 0,
          failure: 0,
        })
      );
    });
  },
  {
    cache: false,
  }
);
