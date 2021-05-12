import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { onOrderedProduct } from "../../../../events/onOrderedProduct.event";
import { OrderHelper } from "../order.helper";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { SettingKey } from "../../../../configs/settingData";
import { CustomerLoader } from "../../customer/customer.model";
import { MemberLoader } from "../../member/member.model";
import { SettingHelper } from "../../setting/setting.helper";

const Mutation = {
  createOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { campaignCode, sellerId, id: buyerId, collaboratorId } = context;
    const data = args.data;
    if (context.isCustomer()) {
      data.buyerId = buyerId;
      data.sellerId = sellerId;
    }

    if (collaboratorId) data.collaboratorId = collaboratorId;
    const [unitPrice, seller, customer] = await Promise.all([
      SettingHelper.load(SettingKey.UNIT_PRICE),
      MemberLoader.load(sellerId),
      CustomerLoader.load(buyerId),
    ]);

    const ordersData = await OrderHelper.modifyOrders({ data, seller });

    // console.log('log loi tai day 1', ordersData);

    const orders: any[] = [];
    for (let orderData of ordersData) {
      const orderHelper = await OrderHelper.fromRaw(orderData);
      // console.log('log loi tai day 1', orderHelper.order);
      await orderHelper.generateItemsFromRaw(orderData.products);

      // console.log('log loi tai day 2', orderHelper.order);
      // Calculate Shipfee
      await orderHelper.calculateShipfee();
      // console.log('log loi tai day 3',orderHelper.order.code);
      // Calculate Amount
      orderHelper.calculateAmount();
      orderHelper.order.code = await OrderHelper.generateCode();

      // console.log('log loi tai day 4',orderHelper.order.code);
      await orderHelper.addCampaign(campaignCode);

      // console.log('orderHelper',orderHelper.order);

      await Promise.all([
        orderHelper.order.save(),
        OrderItemModel.insertMany(orderHelper.order.items),
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
