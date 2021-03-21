import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { ProductModel } from "../../product/product.model";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { onApprovedFailureOrder } from "../../../../events/onApprovedFailureOrder.event";
import { onApprovedCompletedOrder } from "../../../../events/onApprovedCompletedOrder.event";

/*

    CONFIRMED => COMPLETED => Ghi chú lại
    
    RULE
    phải là CONFIRMED
    toMember sẽ xác nhận.
*/

const approveOrder = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { id, note, status } = args;

  if (!id) throw ErrorHelper.requestDataInvalid("mã đơn hàng");

  let params: any = {
    _id: id,
    status: {
      $in: [
        OrderStatus.CONFIRMED, // ko duyet khi don da ok
        OrderStatus.DELIVERING, // ko duyet khi don that bai
      ],
    },
  };

  if (context.isMember()) {
    params.sellerId = context.id;
  }

  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  // giao hàng vnpost
  if (order.shipMethod === ShipMethod.VNPOST) {
    if (order.status === OrderStatus.CONFIRMED) {
      throw ErrorHelper.somethingWentWrong(
        "Không thể hoàn tất đơn hàng [GIAO TẠI ĐỊA CHỈ] này do chưa giao hàng"
      );
    }
  }

  if (![OrderStatus.COMPLETED, OrderStatus.FAILURE].includes(status)) {
    throw ErrorHelper.requestDataInvalid("Không có trạng thái này");
  }

  order.status = status;
  order.note = note;
  for (const orderItemId of order.itemIds) {
    await OrderItemModel.findByIdAndUpdate(
      orderItemId,
      { $set: { status } },
      { new: true }
    );
  }

  return await order.save().then(async (order) => {
    if(order.status === OrderStatus.COMPLETED){
      onApprovedCompletedOrder.next(order);
    }
    if(order.status === OrderStatus.FAILURE){
      onApprovedFailureOrder.next(order);
    }
    return order;
  });
};

const Mutation = {
  approveOrder,
};
export default { Mutation };
