import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { onOrderedProduct } from "../../../../events/onOrderedProduct.event";
import { OrderHelper } from "../order.helper";
import { OrderItemModel } from "../../orderItem/orderItem.model";

const Mutation = {
  createOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { campaignCode, sellerId, id: buyerId } = context;
    const data = args.data;
    
    if (context.isCustomer()) {
      data.buyerId = buyerId;
      data.sellerId = sellerId;
    }

    const ordersData = await OrderHelper.orderProducts(data);
    const orders: any[] = [];
    for (let orderData of ordersData) {
      const orderHelper = await OrderHelper.fromRaw(orderData);
      await orderHelper.generateItemsFromRaw(orderData.products);
      // Calculate Shipfee
      await orderHelper.calculateShipfee();
      // Calculate Amount
      orderHelper.calculateAmount();
      orderHelper.order.code = await OrderHelper.generateCode();

      // const campaignBulk = orderHelper.addCampaignBulk(campaignCode);
      
      await Promise.all([
        orderHelper.order.save(),
        OrderItemModel.insertMany(orderHelper.order.items),
        // OrderHelper.updateOrderedQtyBulk(orderHelper.order.items),
        // (await campaignBulk).execute(),
      ]).then(([order]) => {
        orders.push(order);
      });
    }

    for (const order of orders) {
      onOrderedProduct.next(order);
    }

    return orders;
  },
};

export default {
  Mutation,
};
