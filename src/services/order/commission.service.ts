import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Context, ServiceBroker, ServiceSchema } from "moleculer";
import { Types } from "mongoose";

import { CollaboratorLoader } from "../../graphql/modules/collaborator/collaborator.model";
import {
  CommissionLogModel,
  CommissionLogType,
} from "../../graphql/modules/commissionLog/commissionLog.model";
import { CustomerLoader, CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderLoader } from "../../graphql/modules/order/order.model";
import { CommissionBy, IShopConfig } from "../../graphql/modules/shopConfig/shopConfig.model";
import { DiscountUnit } from "../../graphql/modules/shopVoucher/types/discountItem.schema";
import { ttlCache } from "../../helpers/ttlCache";
import { MainConnection } from "../../loaders/database";

const delay = (duration: number) =>
  new Promise((resolve) => {
    console.log("delay....");
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
export default {
  name: "commission",
  actions: {
    estimateCustomer: {
      params: { id: { type: "string" } },
      async handler(ctx) {
        const { id } = ctx.params;
        const session = await MainConnection.startSession();
        let result = 0;
        try {
          await session.withTransaction(async () => {
            const commission = await CustomerCommissionLoader.load(id);
            await CustomerModel.updateOne(
              { _id: id },
              { $set: { commission } },
              { session }
            ).exec();
            result = commission;
          });
        } finally {
          session.endSession();
          return result;
        }
      },
    },
    estimateFromCustomer: {
      params: { id: { type: "string" }, from: { type: "string" } },
      async handler(ctx) {
        const { id, from } = ctx.params;
        return EstimateCommissionFromCustomerLoader.load([id, from].join("|"));
      },
    },
  },
  methods: {
    async addToCustomerFromOrder(props: { orderId: string; customerId: string; value: number }) {
      const { orderId, customerId, value } = props;
      const [order, customer, log] = await Promise.all([
        OrderLoader.load(orderId),
        CustomerLoader.load(customerId),
        CommissionLogModel.findOne({
          customerId,
          orderId,
          type: CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
        }),
      ]);
      if (!order || !customer) throw Error("Dữ liệu không hợp lệ");
      if (log) return { error: null, data: log };
      const session = await MainConnection.startSession();
      try {
        let result;
        await session.withTransaction(async (session) => {
          const log = new CommissionLogModel({
            customerId: customerId,
            memberId: order.sellerId,
            type: CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
            value: value,
            orderId: order._id,
          });
          await log.save({ session });
          await CustomerModel.updateOne(
            { _id: customerId },
            { $inc: { commission: value } },
            { session }
          ).exec();
          result = { error: null, data: log };
        });
        return result;
      } catch (err) {
        return { error: err.message, data: null };
      } finally {
        await session.endSession();
      }
    },
  },
  events: {
    "order.completed": {
      params: {
        orderId: { type: "string" },
      },
      async handler(ctx: Context<{ orderId: string }>) {
        const { orderId } = ctx.params;
        const order = await OrderLoader.load(orderId);
        let { commission2, collaboratorId, buyerId } = order;
        if (!collaboratorId) return;
        const broker = this.broker as ServiceBroker;
        const [shopConfig, collaborator] = await Promise.all([
          broker.call<IShopConfig, { id: string }>("shopConfig.get", {
            id: order.sellerId.toString(),
          }),
          CollaboratorLoader.load(collaboratorId),
        ]);
        if (!collaborator) return;
        if (shopConfig.colCommissionBy == CommissionBy.ORDER) {
          if (shopConfig.colCommissionUnit == DiscountUnit.VND) {
            commission2 = shopConfig.colCommissionValue;
          } else {
            const baseValue = order.subtotal - order.discount;
            commission2 = (baseValue * shopConfig.colCommissionValue) / 100;
          }
        }
        if (commission2 <= 0) return;

        await this.addToCustomerFromOrder({
          orderId: orderId.toString(),
          customerId: collaborator.customerId.toString(),
          value: commission2,
        });
      },
    },
  },
} as ServiceSchema;

const CustomerCommissionLoader = new DataLoader<string, number>(
  (ids: string[]) => {
    const objectIds = ids.map(Types.ObjectId);
    return CommissionLogModel.aggregate([
      { $match: { customerId: { $in: objectIds } } },
      { $group: { _id: "$customerId", commission: { $sum: "$value" } } },
    ]).then((list) => {
      const keyByIds = keyBy(list, "_id");
      return ids.map((id) => get(keyByIds, id + ".commission", 0));
    });
  },
  { cache: false }
);

const EstimateCommissionFromCustomerLoader = new DataLoader<string, number>(
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
