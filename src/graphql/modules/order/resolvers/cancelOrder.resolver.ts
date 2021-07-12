import { get } from "lodash";

import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { onCanceledOrder } from "../../../../events/onCanceledOrder.event";
import { VietnamPostHelper } from "../../../../helpers";
import { Ahamove } from "../../../../helpers/ahamove/ahamove";
import { Context } from "../../../context";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { ShopConfigModel } from "../../shopConfig/shopConfig.model";
import { OrderModel, OrderStatus, ShipMethod } from "../order.model";

const Mutation = {
  cancelOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.MEMBER_STAFF_CUSTOMER);
    const { id, note } = args;
    const order = await OrderModel.findById(id);
    if (!order) throw ErrorHelper.requestDataInvalid("Đơn hàng không hợp lệ");
    if (context.isCustomer()) {
      if (order.status !== OrderStatus.PENDING) {
        throw ErrorHelper.somethingWentWrong(
          "Đơn hàng này không hủy được. Quý khách vui lòng liên hệ chủ cửa hàng để được hướng dẫn. Xin cảm ơn."
        );
      }
    }
    if (
      ![OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING].includes(order.status)
    ) {
      throw ErrorHelper.somethingWentWrong("Đơn hàng này không hủy được.");
    }
    const shopConfig = await ShopConfigModel.findOne({ memberId: order.sellerId });
    if (
      order.status === OrderStatus.DELIVERING &&
      order.deliveryInfo.itemCode &&
      order.shipMethod == ShipMethod.VNPOST
    ) {
      await VietnamPostHelper.cancelOrder(order.deliveryInfo.orderId, shopConfig.vnpostToken);
    }
    if (order.shipMethod == ShipMethod.AHAMOVE) {
      const ahamove = new Ahamove({});
      const ahamoveOrder = await ahamove.fetchOrder(
        shopConfig.shipAhamoveToken,
        order.deliveryInfo.orderId
      );
      const result = await ahamove
        .cancelOrder(shopConfig.shipAhamoveToken, order.deliveryInfo.orderId, note)
        .catch((err) => {
          throw Error(
            "Không thể huỷ đơn Ahamove cho đơn hàng này. " +
              get(Ahamove.StatusText, ahamoveOrder.status)
          );
        });
    }

    // Thực hiện huỷ đơn
    order.status = OrderStatus.CANCELED;
    order.cancelReason = note;
    await OrderItemModel.updateMany(
      { orderId: order._id },
      { $set: { status: OrderStatus.CANCELED } }
    ).exec;

    return await Promise.all([order.save()]).then(async (res) => {
      const result = res[0];
      onCanceledOrder.next(result);
      return result;
    });
  },
};

export default { Mutation };
