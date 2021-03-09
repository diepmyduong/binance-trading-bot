import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { onConfirmedOrder } from "../../../../events/onConfirmedOrder.event";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { MemberModel } from "../../member/member.model";

//[Backend] Cung cấp API duyệt lịch sử đăng ký dịch vụ SMS
const transferOrder = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { id, memberId, note } = args;

  if (!id) throw ErrorHelper.requestDataInvalid("mã đơn hàng");
  if (!memberId) throw ErrorHelper.requestDataInvalid("mã chủ shop");

  // params lấy ra danh sách pending
  let params: any = {
    _id: id,
  };

  // tạo params lấy ra đơn hàng của chủ shop đó
  if (context.isMember()) {
    params.sellerId = context.id;
  }

  // lấy ra danh sách như params
  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  if (order.status === OrderStatus.DELIVERING) {
    throw ErrorHelper.somethingWentWrong(
      "Không thể chuyển đơn hàng này do trạng thái đơn hàng đang vận chuyển."
    );
  }

  if (order.status === OrderStatus.COMPLETED) {
    throw ErrorHelper.somethingWentWrong(
      "Không thể chuyển đơn hàng này do trạng thái đơn hàng đã thành công."
    );
  }

  if (order.status === OrderStatus.RETURNED) {
    throw ErrorHelper.somethingWentWrong(
      "Không thể chuyển đơn hàng này do trạng thái đơn hàng đã hoàn hàng thành công."
    );
  }

  const member = await MemberModel.findById(memberId);

  if (!member) {
    throw ErrorHelper.mgRecoredNotFound("bưu cục này.");
  }

  order.toMemberId = member.id;

  for (const orderId of order.itemIds) {
    await OrderItemModel.findByIdAndUpdate(
      orderId,
      { $set: { status: OrderStatus.PENDING } },
      { new: true }
    );
  }

  order.status = OrderStatus.PENDING;
  order.note = note;

  return await order.save().then(async (order) => {
    // onConfirmedOrder.next(order);
    return order;
  });
};

const Mutation = {
  transferOrder,
};
export default { Mutation };
