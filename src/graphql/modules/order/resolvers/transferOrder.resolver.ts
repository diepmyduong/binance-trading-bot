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
    $in: [
      OrderStatus.PENDING, // ko duyet khi don da ok
    ],
  };

  // tạo params lấy ra đơn hàng của chủ shop đó
  if (context.isMember()) {
    params.sellerId = context.id;
  }

  // lấy ra danh sách như params
  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  const member = await MemberModel.findById(memberId);

  if (!member) {
    throw ErrorHelper.mgRecoredNotFound("bưu cục này.");
  }

/*
điểm nhận	code	`=> Bưu cục nào		`=> 
				
đến kho	code			
				
A => A	toMemberId = null			
A => B	toMemberId = getMemberIdByAddressDeliveryCode()			

*/


  order.toMemberId = member.id;

  for (const orderId of order.itemIds) {
    await OrderItemModel.findByIdAndUpdate(
      orderId,
      { $set: { status: OrderStatus.PENDING } },
      { new: true }
    );
  }

  order.status = OrderStatus.PENDING;
  order.toMemberNote = note;

  return await order.save().then(async (order) => {
    // onConfirmedOrder.next(order);
    return order;
  });
};

const Mutation = {
  transferOrder,
};
export default { Mutation };
