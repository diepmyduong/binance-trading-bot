import { ROLES } from "../../../../constants/role.const";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { OrderItemLoader } from "../../orderItem/orderItem.model";
import { OrderHelper } from "../order.helper";
import { IOrder } from "../order.model";

class OrderContext extends Context {
  isDraft: boolean; // Đơn hàng nháp
}

type DraftOrderData = {
  orders: any; // Đơn hàng
  invalid: boolean; // không hợp lệ
  invalidReason: string; // lý do không hợp lệ
};

const Mutation = {
  generateDraftDeliveryOrder: async (
    root: any,
    args: any,
    context: OrderContext
  ) => {
    // tech --------------------
    // context.isDraft = true;
    const { sellerId, id: buyerId, campaignCode, collaboratorId } = context;
    const data = args.data;
    if (context.isCustomer()) {
      data.buyerId = buyerId;
      data.sellerId = sellerId;
    }
    data.collaboratorId = collaboratorId;
    // console.log('----------------> orderdata',data);

    try {
      const ordersData = await OrderHelper.modifyOrders(data);
      const orders: any[] = [];
      // for (let orderData of ordersData) {
      //   const orderHelper = await OrderHelper.fromRaw(orderData);
      //   await orderHelper.generateItemsFromRaw(orderData.products);

      //   // console.log("result generateItemsFromRaw", orderHelper.order);
      //   // Calculate Shipfee
      //   await orderHelper.calculateShipfee();
      //   // console.log("result calculateShipfee", orderHelper.order);
      //   // Calculate Amount
      //   orderHelper.calculateAmount();
      //   // console.log("result calculateAmount", orderHelper.order);

      //   await orderHelper.addCampaign(campaignCode);

      //   // console.log('order',orderHelper.order);s

      //   orders.push(orderHelper.order);
      // }

      // const cloneObj = Object.assign({}, orders[0]._doc);
      // // orders[1] = {...cloneObj, id: "testId"}
      // const allOrder: IOrder = { ...cloneObj };
      // for (let i = 1; i <= orders.length; i++) {
      //   const order: IOrder = orders[i];
      //   if (order) {
      //     allOrder.itemCount = allOrder.itemCount + order.itemCount;
      //     allOrder.shipfee = allOrder.shipfee + order.shipfee;
      //     allOrder.amount = allOrder.amount + order.amount;
      //     allOrder.subtotal = allOrder.subtotal + order.subtotal;
      //   }
      // }

      return {
        orders,
        allOrder:[],
        invalid: false,
        invalidReason: null,
      } as DraftOrderData;
    } catch (err) {
      return {
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