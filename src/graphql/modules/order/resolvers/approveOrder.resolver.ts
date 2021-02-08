import { ErrorHelper } from "../../../../base/error";
// import { OrderStatus } from "../../../../constants/model.const";
import { ROLES } from "../../../../constants/role.const";
// import { OnApprovedOrder } from "../../../../events/onApprovedOrder.event";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
// import { OrderLogModel, OrderLogType } from "../../orderLog/orderLog.model";
import { IOrder, OrderModel } from "../order.model";

const Mutation = {
  approveOrder: async (root: IOrder, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    // const { orderId } = args;
    // const order = await OrderModel.findById(orderId);
    // if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    // // Chỉ duyệt đơn hàng đang pending
    // const isDeliveringOrder = order.status == OrderStatus.DELIVERING;
    // if (!isDeliveringOrder)
    //   throw ErrorHelper.requestDataInvalid("Đơn hàng không hợp lệ");
    // Cập nhật đơn hàng
    // order.status = OrderStatus.APPROVED;
    // return await order.save().then(async (res) => {
    //   OnApprovedOrder.next(res);
    //   await OrderLogModel.create({
    //     orderId: res._id,
    //     type: OrderLogType.APPROVED,
    //     userId: context.id,
    //   });
    //   return res;
    // });
  },
};

export default { Mutation };
