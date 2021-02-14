import { ErrorHelper } from "../../../../base/error";
// import { OrderStatus } from "../../../../constants/model.const";
import { ROLES } from "../../../../constants/role.const";
// import { OnCanceledOrder } from "../../../../events/onCanceledOrder.event";
import { AuthHelper } from "../../../../helpers";
import { ViettelPostHelper } from "../../../../helpers/viettelPost/viettelPost.helper";
import { Context } from "../../../context";
// import { OrderLogModel, OrderLogType } from "../../orderLog/orderLog.model";
import { OrderModel } from "../order.model";

const Mutation = {
  cancelOrder: async (root: any, args: any, context: Context) => {
    // AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_CUSTOMER);
    // const { orderId } = args;
    // const order = await OrderModel.findById(orderId);
    // if (context.isCustomer() && order.buyerId.toString() != context.id) {
    //   throw ErrorHelper.permissionDeny();
    // }
    // // Kiểm tra trạng thái đơn hàng
    // if (order.status != OrderStatus.PENDING) {
    //   if (order.status != OrderStatus.DELIVERING || context.isCustomer())
    //     throw ErrorHelper.requestDataInvalid("Đơn hàng không thể huỷ");
    // }
    // Huỷ vận đơn
    // if (
    //   order.shipMethod == ShipMethod.VIETTEL_POST &&
    //   order.deliveryInfo &&
    //   order.deliveryInfo.orderNumber
    // ) {
    //   await ViettelPostHelper.updateOrder({
    //     orderNumber: order.deliveryInfo.orderNumber,
    //     type: 4,
    //     date: new Date(),
    //     note: "Huỷ đơn đặt hàng",
    //   }).catch((err) => {
    //     if (!/Đơn hàng đã hủy/.test(err.message)) throw err;
    //   });
    // }
    // Thực hiện huỷ đơn
    // order.status = OrderStatus.CANCELED;
    // return order.save().then(async (res) => {
    //   OnCanceledOrder.next(res);
    //   if (context.isCustomer()) {
    //     await OrderLogModel.create({
    //       orderId: res._id,
    //       type: OrderLogType.CUSTOMER_CANCELED,
    //       customerId: context.id,
    //     });
    //   } else {
    //     await OrderLogModel.create({
    //       orderId: res._id,
    //       type: OrderLogType.USER_CANCELED,
    //       userId: context.id,
    //     });
    //   }
    //   return res;
    // });
  },
};

export default { Mutation };
