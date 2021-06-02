import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { Dictionary, get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderModel } from "../order/order.model";
import { OrderItemModel } from "../orderItem/orderItem.model";

export default {
  schema: gql`
    extend type CollaboratorProduct {
      orderStats(fromDate: String, toDate: String): CollaboratorProductOrderStats
    }
    type CollaboratorProductOrderStats {
      completeOrder: Int
      uncompleteOrder: Int
      completeProductQty: Int
      uncompleteProductQty: Int
    }
  `,
  resolver: {
    CollaboratorProduct: {
      orderStats: async (root: any, args: any, context: Context) => {
        const { fromDate, toDate } = args;
        return getLoader(fromDate, toDate).load(root.productId);
      },
    },
  },
};

const loaders: Dictionary<DataLoader<string, CollaboratorProductOrderStats>> = {};

type CollaboratorProductOrderStats = {
  completeOrder: number;
  uncompleteOrder: number;
  completeProductQty: number;
  uncompleteProductQty: number;
};

function getLoader(fromDate: string, toDate: string) {
  const hash = fromDate + toDate;
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
  if (!loaders[hash]) {
    loaders[hash] = new DataLoader<string, CollaboratorProductOrderStats>(
      async (ids) => {
        const objectIds = ids.map(Types.ObjectId);
        const orderIds = await getOrderIds(objectIds, $gte, $lte);
        const statusComplete = { $in: ["$order.status", ["COMPLETED"]] };
        const statusUncomplete = {
          $in: ["order.$status", ["PENDING", "CONFIRMED", "DELIVERING"]],
        };
        const query = [
          { $match: { orderId: { $in: orderIds } } },
          { $group: { _id: "$orderId", productQty: { $sum: "$qty" } } },
          { $lookup: { from: "orders", localField: "_id", foreignField: "_id", as: "order" } },
          { $unwind: "$order" },
          {
            $group: {
              _id: "$order.productId",
              completeOrder: { $sum: { $cond: [statusComplete, 1, 0] } },
              uncompleteOrder: { $sum: { $cond: [statusUncomplete, 1, 0] } },
              completeProductQty: { $sum: { $cond: [statusComplete, "$productQty", 0] } },
              uncompleteProductQty: { $sum: { $cond: [statusUncomplete, "$productQty", 0] } },
            },
          },
        ];
        return await OrderItemModel.aggregate(query).then((list) => {
          let listKeyBy = keyBy(list, "_id");
          return ids.map((id) => {
            return get(listKeyBy, id, {
              completeOrder: 0,
              uncompleteOrder: 0,
              completeProductQty: 0,
              uncompleteProductQty: 0,
            } as CollaboratorProductOrderStats);
          });
        });
      },
      { cache: false } // Bỏ cache
    );
  }
  return loaders[hash];
}

async function getOrderIds(objectIds: Types.ObjectId[], $gte: Date, $lte: Date) {
  const $match: any = {
    collaboratorId: { $in: objectIds },
  };
  if ($gte) set($match, "createdAt.$gte", $gte);
  if ($lte) set($match, "loggedAt.$lte", $lte);
  const orderIds = await OrderModel.aggregate([
    { $match: $match },
    { $project: { _id: 1 } },
  ]).then((res) => res.map((r) => Types.ObjectId(r._id)));
  return orderIds;
}
