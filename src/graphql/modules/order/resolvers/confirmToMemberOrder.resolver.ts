import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { onConfirmedOrder } from "../../../../events/onConfirmedOrder.event";
import { OrderItemModel } from "../../orderItem/orderItem.model";

/*
    PENDING => xác nhận => CONFIRMED
    
    RULE
    phải là PENDING
    toMember sẽ xác nhận.
*/

const confirmToMemberOrder = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { id } = args;

  if (!id) throw ErrorHelper.requestDataInvalid("mã đơn hàng");

  // params lấy ra danh sách pending
  let params: any = {
    _id: id,
    status: { $in: [OrderStatus.PENDING] },
  };

  // tạo params lấy ra đơn hàng của chủ shop đó
  if (context.isMember()) {
    params.toMemberId = context.id;
  }

  // lấy ra danh sách như params
  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  for (const orderItem of order.itemIds) {
    // Duyệt số lượng sao đó trừ inventory
    await OrderItemModel.findByIdAndUpdate(
      orderItem,
      { $set: { status: OrderStatus.CONFIRMED } },
      { new: true }
    );
  }

  order.status = OrderStatus.CONFIRMED;

  return await order.save().then(async (order) => {
    onConfirmedOrder.next(order);
    return order;
  });
};

const Mutation = {
  confirmToMemberOrder,
};
export default { Mutation };
