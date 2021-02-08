import { validateJSON } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { CampaignLoader } from "../../campaign/campaign.model";
import { EVoucherLoader } from "../../eVoucher/eVoucher.model";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { OrderHelper } from "../order.helper";
import { IOrder } from "../order.model";

class OrderContext extends Context {
  isDraft: boolean; // Đơn hàng nháp
}

type DraftOrderData = {
  order: IOrder; // Đơn hàng
  invalid: boolean; // không hợp lệ
  invalidReason: string; // lý do không hợp lệ
};

const Mutation = {
  generateDraftOrder: async (root: any, args: any, context: OrderContext) => {
    context.isDraft = true;
    const { items, ...orderData } = args.data;
    if (context.isCustomer()) {
      orderData.customerId = context.id;
    } else if (!orderData.isAnonymous) {
      validateJSON(orderData, { required: ["customerId"] });
    }
    const orderHelper = await OrderHelper.fromRaw(orderData);
    try {
      // Generate Order Items
      await orderHelper.generateItemsFromRaw(items);
      // Calculate Shipfee
      // await orderHelper.calculateShipfee();
      // Calculate Amount
      orderHelper.calculateAmount();
      // Calculate cumulativePoint
      // await orderHelper.calculateCumulativePoint();
      return {
        order: orderHelper.order,
        invalid: false,
        invalidReason: null,
      } as DraftOrderData;
    } catch (err) {
      return {
        order: orderHelper.order,
        invalid: true,
        invalidReason: err.message,
      };
    }
  },
};
const Order = {
  items: async (root: IOrder, args: any, context: OrderContext) => {
    if (context.isDraft) {
      // return root.items;
    } else {
      return GraphQLHelper.loadManyById(OrderItemLoader, "itemIds")(
        root,
        args,
        context
      );
    }
  },
};
export default { Mutation, Order };
