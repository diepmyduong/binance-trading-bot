import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { ServiceSchema } from "moleculer";
import { Types } from "mongoose";
import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderLoader, OrderModel } from "../../graphql/modules/order/order.model";
import { ttlCache } from "../../helpers/ttlCache";

export default {
  name: "customerContext",
  actions: {
    estimateOrder: {
      params: { customerId: { type: "string" } },
      async handler(ctx) {
        const { customerId } = ctx.params;
        return EstimateOrderLoader.load(customerId);
      },
    },
  },
  events: {
    "order.pending": {
      params: { orderId: { type: "string" } },
      async handler(ctx: any) {
        const { orderId } = ctx.params;
        const order = await OrderLoader.load(orderId);
        if (!order) return;
        await CustomerModel.updateOne({ _id: order.buyerId }, { $inc: { "context.order": 1 } });
      },
    },
  },
} as ServiceSchema;

const EstimateOrderLoader = new DataLoader<string, number>(
  (ids: string[]) => {
    const objectIds = ids.map(Types.ObjectId);
    return OrderModel.aggregate([
      { $match: { buyerId: { $in: objectIds } } },
      { $group: { _id: "$buyerId", count: { $sum: 1 } } },
    ]).then((list) => {
      const bulk = CustomerModel.collection.initializeUnorderedBulkOp();
      list.forEach((l) => {
        bulk.find({ _id: Types.ObjectId(l._id) }).updateOne({ $set: { "context.order": l.count } });
      });
      if (bulk.length > 0) {
        bulk
          .execute()
          .catch((err) => {})
          .then(() => {
            console.log("updated", bulk.length);
          });
      }
      const keyByIds = keyBy(list, "_id");
      return ids.map((id) => get(keyByIds, id + ".count", 0));
    });
  },
  { cache: true, cacheMap: ttlCache({ ttl: 30000 * 10, maxSize: 100 }) }
);
