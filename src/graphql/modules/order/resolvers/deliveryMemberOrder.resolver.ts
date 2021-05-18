import { ROLES } from "../../../../constants/role.const";
import { onMemberDelivering } from "../../../../events/onMemberDelivering.event";
import { ErrorHelper } from "../../../../helpers/error.helper";
import { Context } from "../../../context";
import { OrderModel, OrderStatus } from "../order.model";

const Mutation = {
  deliveryMemberOrder: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;

    // console.log("id", id);

    let params: any = {
      _id: id,
      status: OrderStatus.CONFIRMED,
    };

    if (context.isMember()) {
      params.sellerId = context.id;
    }

    console.log("params", params);

    const order = await OrderModel.findOne(params);

    if (!order) {
      throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    }

    order.status = OrderStatus.DELIVERING;

    return await order.save().then(async (order) => {
      onMemberDelivering.next(order);
      return order;
    });
  },
};

export default { Mutation };
