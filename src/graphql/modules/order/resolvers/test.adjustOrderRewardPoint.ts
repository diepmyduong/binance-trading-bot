import { Context } from "../../../context";
import { ROLES } from "../../../../constants/role.const";
import { OrderModel } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
// import { OrderLogModel, OrderLogType } from "../../orderLog/orderLog.model";
// import { OrderStatus } from "../../../../constants/model.const";

const Mutation = {
  adjustOrderRewardPoint: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    // const { orderId, value } = args;
    // const order = await OrderModel.findById(orderId);
    // if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
    // if (order.status != OrderStatus.PENDING)
    //   throw ErrorHelper.requestDataInvalid("Đơn hàng không hợp lệ");
    // if (order.rewardPoint == value) return order;
    // const adjustValue = value - order.rewardPoint;
    // order.rewardPoint = value;
    // return await order.save().then(async (res) => {
    //   await OrderLogModel.create({
    //     orderId: res._id,
    //     type: OrderLogType.ADJUST_REWARD_POINT,
    //     userId: context.id,
    //     value: adjustValue,
    //   });
    //   return res;
    // });
  },
};

export default { Mutation };
