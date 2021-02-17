import { ErrorHelper, validateJSON } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { CampaignLoader } from "../../campaign/campaign.model";
import { EVoucherLoader } from "../../eVoucher/eVoucher.model";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { ProductModel, ProductType } from "../../product/product.model";
import { OrderHelper } from "../order.helper";
import { IOrder } from "../order.model";
import { orderService } from "../order.service";

class OrderContext extends Context {
  isDraft: boolean; // Đơn hàng nháp
}

type DraftOrderData = {
  orders: any; // Đơn hàng
  invalid: boolean; // không hợp lệ
  invalidReason: string; // lý do không hợp lệ
};

const Mutation = {
  generateDraftOrder: async (root: any, args: any, context: OrderContext) => {
    // tech --------------------
    // context.isDraft = true;
    const { sellerId, id: buyerId } = context;
    const data = args.data;
    if (context.isCustomer()) {
      data.customerId = buyerId;
      data.sellerId = sellerId;
    }

    try {
      const ordersData = await OrderHelper.createOrdersDataRaw(data);
      const orders: any[] = [];
      for (let orderData of ordersData) {
        const orderHelper = await OrderHelper.fromRaw(orderData);
        await orderHelper.generateItemsFromRaw(orderData.items);
        // Calculate Shipfee
        await orderHelper.calculateShipfee();
        // Calculate Amount
        orderHelper.calculateAmount();
        orders.push(orderHelper);
      }

      // console.log("-------------------->>>>>>>", orders);
      return {
        orders,
        invalid: false,
        invalidReason: null,
      } as DraftOrderData;
    } catch(err) {
      return {
        invalid: true,
        invalidReason: err.message,
      }
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
