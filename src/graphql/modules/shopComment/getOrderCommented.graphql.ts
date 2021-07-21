import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { keyBy, uniq } from "lodash";
import { Types } from "mongoose";
import { ttlCache } from "../../../helpers/ttlCache";
import { Context } from "../../context";
import { IOrder } from "../order/order.model";
import { ShopCommentModel } from "./shopComment.model";

export default {
  schema: gql`
    extend type Order {
      commented: Boolean
    }
  `,
  resolver: {
    Order: {
      commented: async (root: IOrder, args: any, context: Context) => {
        if (!context.isCustomer()) return false;
        return OrderCommentedLoader.load([root._id, root.buyerId].join("."));
      },
    },
  },
};

export const OrderCommentedLoader = new DataLoader<string, boolean>(
  (ids: string[]) => {
    const splitIds = ids.map((id) => id.split("."));
    const orderIds = uniq(splitIds.map(([orderId, _]) => Types.ObjectId(orderId)));
    const customerIds = uniq(splitIds.map(([_, customerId]) => Types.ObjectId(customerId)));
    return ShopCommentModel.aggregate([
      { $match: { orderId: { $in: orderIds }, customerId: { $in: customerIds } } },
      { $group: { _id: { orderId: "$orderId", customerId: "$customerId" }, count: { $sum: 1 } } },
    ]).then((list) => {
      const keyById = keyBy(
        list.map((l) => {
          l.id = [l._id.orderId, l._id.customerId].join(".");
          return l;
        }),
        "id"
      );
      return ids.map((id) => !!keyById[id]);
    });
  },
  {
    cache: true,
    cacheMap: ttlCache({ ttl: 30000, maxSize: 100 }),
  }
);
