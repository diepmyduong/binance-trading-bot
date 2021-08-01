import { ServiceSchema } from "moleculer";

import { CustomerModel } from "../../graphql/modules/customer/customer.model";
import { OrderLoader } from "../../graphql/modules/order/order.model";
import { CustomerOrderStatsLoader } from "./loader/customerOrderStats.loader";

export default {
  name: "customerContext",
  actions: {
    estimateOrder: {
      params: { customerId: { type: "string" } },
      async handler(ctx) {
        const { customerId } = ctx.params;
        return CustomerOrderStatsLoader.load(customerId);
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
        await CustomerModel.updateOne(
          { _id: order.buyerId },
          {
            $inc: {
              "context.order": 1,
              "context.discount": order.discount,
              "context.voucher": order.voucherId ? 1 : 0,
            },
          }
        );
      },
    },
    "order.completed": {
      params: { orderId: { type: "string" } },
      async handler(ctx: any) {
        const { orderId } = ctx.params;
        const order = await OrderLoader.load(orderId);
        if (!order) return;
        await CustomerModel.updateOne(
          { _id: order.buyerId },
          { $inc: { "context.completed": 1, "context.revenue": order.amount } }
        );
      },
    },
    "order.failure": {
      params: { orderId: { type: "string" } },
      async handler(ctx: any) {
        const { orderId } = ctx.params;
        const order = await OrderLoader.load(orderId);
        if (!order) return;
        await CustomerModel.updateOne({ _id: order.buyerId }, { $inc: { "context.canceled": 1 } });
      },
    },
  },
} as ServiceSchema;
