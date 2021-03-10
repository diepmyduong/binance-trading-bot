import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { onCanceledOrder } from "../../../../events/onCanceledOrder.event";
import { AuthHelper, VietnamPostHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { ProductModel } from "../../product/product.model";
import { OrderModel, OrderStatus } from "../order.model";

const Mutation = {
  cancelOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id, note } = args;
    const params: any = {
      _id: id,
    };

    // User customer - PENDING    -> CANCELED

    // User member PENDING- DELIVERING -> CANCEL DELIVERING -> CHECK DELIVERING CANCELED -> CANCELED

    if (context.isMember()) {
      params.sellerId = context.id;
    }

    if (context.isCustomer()) {
      params.buyerId = context.id;
      params.sellerId = context.sellerId;
    }

    const order = await OrderModel.findOne({ ...params });

    if (!order) throw ErrorHelper.requestDataInvalid("Đơn hàng không hợp lệ");

    if (context.isCustomer()) {
      if (order.status !== OrderStatus.PENDING) {
        throw ErrorHelper.somethingWentWrong(
          "Đơn hàng này không hủy được. Quý khách vui lòng liên hệ chủ cửa hàng để được hướng dẫn. Xin cảm ơn."
        );
      }
    }

    if (context.isMember()) {
      if (order.status !== OrderStatus.PENDING) {
        throw ErrorHelper.somethingWentWrong(
          "Đơn hàng này không hủy được."
        );
      }
    }

    if (order.status === OrderStatus.DELIVERING) {
      await VietnamPostHelper.cancelOrder(order.deliveryInfo.orderId);
    }

    // Thực hiện huỷ đơn
    order.status = OrderStatus.CANCELED;
    // Trừ orderQty
    for (const orderId of order.itemIds) {
      // Duyệt số lượng sao đó trừ inventory
      await OrderItemModel.findByIdAndUpdate(
        orderId,
        { $set: { status: OrderStatus.CANCELED, note } },
        { new: true }
      );
    }

    return await Promise.all([order.save()]).then(async (res) => {
      const result = res[0];
      onCanceledOrder.next(result);
      return result;
    });
  },
};

export default { Mutation };
