import DataLoader from "dataloader";
import { keyBy, get } from "lodash";
import { Types } from "mongoose";
import {
  CommissionLogModel,
  CommissionLogType,
} from "../graphql/modules/commissionLog/commissionLog.model";
import { ttlCache } from "../helpers/ttlCache";

export const EstimateCommissionFromCustomerLoader = new DataLoader<string, number>(
  (ids: string[]) => {
    const splits = ids.map((id) => id.split("|"));
    const presenterIds = splits.map((l) => Types.ObjectId(l[0]));
    const buyerIds = splits.map((l) => Types.ObjectId(l[1]));
    return CommissionLogModel.aggregate([
      {
        $match: {
          customerId: { $in: presenterIds },
          type: CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      { $match: { "order.buyerId": { $in: buyerIds } } },
      {
        $group: {
          _id: { buyerId: "$order.buyerId", customerId: "$customerId" },
          commission: { $sum: "$value" },
        },
      },
    ]).then((list) => {
      const keyByIds = keyBy(
        list.map((l) => {
          l.id = [l._id.customerId, l._id.buyerId].join("|");
          return l;
        }),
        "id"
      );
      return ids.map((id) => get(keyByIds, id + ".commission", 0));
    });
  },
  {
    cache: true,
    cacheMap: ttlCache({ ttl: 30000, maxSize: 100 }),
  }
);
