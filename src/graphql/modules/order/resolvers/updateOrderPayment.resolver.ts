import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderHelper } from "../order.helper";
import { OrderModel } from "../order.model";

const Mutation = {
  updateOrderPayment: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { orderId, paymentStatus } = args;
    const order = await OrderModel.findById(orderId);
    if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    // if (order.paymentStatus == paymentStatus) return order;
    const helper = new OrderHelper(order);
    // await helper.updatePaymentStatus(paymentStatus, context.id);
    return helper.order;
  },
};

export default { Mutation };
