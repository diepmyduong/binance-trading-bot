import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { onConfirmedOrder } from "../../../../events/onConfirmedOrder.event";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { MemberModel } from "../../member/member.model";

/*
    PENDING => xác nhận => CONFIRMED
    
    RULE
    phải là PENDING
    member đó xác nhận.
*/

const confirmOrder = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { id, note } = args;

  if (!id) throw ErrorHelper.requestDataInvalid("mã đơn hàng");

  // params lấy ra danh sách pending
  let params: any = {
    _id: id,
    status: { $in: [OrderStatus.PENDING] },
  };

  // tạo params lấy ra đơn hàng của chủ shop đó
  if (context.isMember()) {
    params.sellerId = context.id;
  }

  // lấy ra danh sách như params
  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  const temp = JSON.stringify({id:order.addressDeliveryId.toString()});

  let addressDeliveryId =  JSON.parse(temp).id;
  // console.log('addressDeliveryId',addressDeliveryId);

  const member = await MemberModel.findById(context.id);

  if(order.shipMethod === ShipMethod.POST){
    const addressDeliveryByCode = await AddressDeliveryModel.findOne({code:member.code});

    if(order.addressDeliveryId !== addressDeliveryByCode.id){
       order.oldAddressDeliveryId = addressDeliveryId,
       order.addressDeliveryId = addressDeliveryByCode.id
    }
  }

  for (const orderItemId of order.itemIds) {
    // Duyệt số lượng sao đó trừ inventory
    await OrderItemModel.findByIdAndUpdate(
      orderItemId,
      { $set: { status: OrderStatus.CONFIRMED } },
      { new: true }
    );
  }

  note ? order.note = note : null;
  order.status = OrderStatus.CONFIRMED;


  return await order.save().then(
    async (order) => {
      onConfirmedOrder.next(order);
      return order;
    }
  );
};

const Mutation = {
  confirmOrder,
};
export default { Mutation };
