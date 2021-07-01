import { gql } from "apollo-server-express";
import { get } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { Context } from "../../context";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { OrderModel, ShipMethod } from "./order.model";

export default {
  schema: gql`
    extend type Mutation {
      cancelAhamoveOrder(orderId: ID!, comment: String!): Mixed
    }
  `,
  resolver: {
    Mutation: {
      cancelAhamoveOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { orderId, comment } = args;
        let order = await OrderModel.findById(orderId);
        if (!order) throw Error("Không tìm thấy đơn hàng");
        if (order.sellerId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
        if (order.shipMethod != ShipMethod.AHAMOVE)
          throw Error("Đơn không được chuyển cho Ahamove");
        const shopConfig = await ShopConfigModel.findOne({ memberId: context.sellerId });
        const ahamove = new Ahamove({});
        const ahamoveOrder = await ahamove.fetchOrder(
          shopConfig.shipAhamoveToken,
          order.deliveryInfo.orderId
        );
        const result = await ahamove
          .cancelOrder(shopConfig.shipAhamoveToken, order.deliveryInfo.orderId, comment)
          .catch((err) => {
            throw Error(
              "Không thể huỷ đơn Ahamove cho đơn hàng này. " +
                get(Ahamove.StatusText, ahamoveOrder.status)
            );
          });
        order = await OrderModel.findOneAndUpdate(
          { _id: order._id },
          { $unset: { shipMethod: 1, deliveryInfo: 1 } },
          { new: true }
        );
        return order;
      },
    },
  },
};
