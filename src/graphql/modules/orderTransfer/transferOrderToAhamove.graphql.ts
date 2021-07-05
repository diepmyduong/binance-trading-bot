import { gql } from "apollo-server-express";
import { compact, get } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { ErrorHelper } from "../../../helpers";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { CreateOrderProps } from "../../../helpers/ahamove/type";
import { Context } from "../../context";
import { IOrder, OrderModel, OrderStatus, ShipMethod } from "../order/order.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import { IShopBranch, ShopBranchModel } from "../shopBranch/shopBranch.model";
import { IShopConfig, ShopConfigModel } from "../shopConfig/shopConfig.model";

export default {
  schema: gql`
    extend type Mutation {
      transferOrderToAhamove(orderId: ID!, serviceId: String!): Order
    }
  `,
  resolver: {
    Mutation: {
      transferOrderToAhamove: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId, serviceId } = args;
        const order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không tìm thấy đơn hàng");
        if (order.status != OrderStatus.CONFIRMED || order.shipMethod)
          throw Error("Đơn hàng không hợp lệ");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        const [orderItems, shopConfig, branch] = await Promise.all([
          OrderItemModel.find({ orderId: order._id }),
          ShopConfigModel.findOne({ memberId: context.sellerId }),
          ShopBranchModel.findById(order.shopBranchId),
        ]);
        const { order: ahamoveOrder } = await createAhamoveOrder(
          branch,
          shopConfig,
          order,
          serviceId,
          orderItems
        );

        order.shipMethod = ShipMethod.AHAMOVE;
        order.deliveryInfo = { ...order.deliveryInfo };
        order.deliveryInfo.orderId = ahamoveOrder._id;
        order.deliveryInfo.serviceName = ahamoveOrder.service_id;
        order.deliveryInfo.status = ahamoveOrder.status;
        order.deliveryInfo.statusText = get(Ahamove.StatusText, ahamoveOrder.status);
        order.deliveryInfo.partnerFee = ahamoveOrder.total_pay;
        order.deliveryInfo.deliveryTime = `${(ahamoveOrder.duration / 60).toFixed(0)} phút`;
        await order.save();
        return order;
      },
    },
  },
};
async function createAhamoveOrder(
  branch: IShopBranch,
  shopConfig: IShopConfig,
  order: IOrder,
  serviceId: any,
  orderItems: IOrderItem[]
) {
  const ahamove = new Ahamove({});
  const lat: number = get(branch, "location.coordinates.1");
  const lng: number = get(branch, "location.coordinates.0");
  const address = compact([branch.address, branch.ward, branch.district, branch.province]).join(
    ", "
  );
  const buyerAddress = compact([
    order.buyerAddress,
    order.buyerWard,
    order.buyerDistrict,
    order.buyerProvince,
  ]).join(", ");
  const ahamoveOrder = await ahamove.createOrder({
    token: shopConfig.shipAhamoveToken,
    order_time: parseInt((Date.now() / 1000).toFixed(0)),
    path: [
      {
        lat: lat,
        lng: lng,
        address: address,
        short_address: branch.district,
        name: branch.name,
        remarks: order.note,
      },
      {
        lat: parseFloat(order.latitude),
        lng: parseFloat(order.longitude),
        address: buyerAddress,
        short_address: order.buyerDistrict,
        name: order.buyerName,
      },
    ],
    payment_method: "CASH",
    remarks: order.note,
    service_id: serviceId,
    items: orderItems.map((i) => ({
      _id: i._id,
      name: i.productName,
      num: i.qty,
      price: i.amount,
    })),
  } as CreateOrderProps);
  return ahamoveOrder;
}
