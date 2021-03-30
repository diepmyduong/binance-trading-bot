import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { onConfirmedOrder } from "../../../../events/onConfirmedOrder.event";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { AddressDeliveryModel } from "../../addressDelivery/addressDelivery.model";
import { MemberModel } from "../../member/member.model";
import { AddressStorehouseModel } from "../../addressStorehouse/addressStorehouse.model";


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

  // lấy ra order như params
  const order = await OrderModel.findOne(params);
  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  // lấy ra member 
  const member = await MemberModel.findById(order.sellerId);
  if (!member) throw Error("Không tìm thấy chủ shop trong đơn hàng này");
  if (context.id !== member.id) throw Error("Không thể thao tác trên đơn hàng này do không đúng chủ shop");

  const temp = Object.create(order);
  // kiem tra
  if (order.shipMethod === ShipMethod.POST) {
    const addressDeliveryByCode = await AddressDeliveryModel.findOne({
      code: member.code,
    });

    if(!addressDeliveryByCode){
      throw Error("Không thể xác nhận đơn hàng do chưa cập nhật mã bưu cục cho địa điểm nhận hàng");
    }

    if (order.addressDeliveryId !== addressDeliveryByCode.id) {
      order.oldAddressDeliveryId = temp.addressDeliveryId;
      order.addressDeliveryId = addressDeliveryByCode.id;
    }
  }

  if (order.shipMethod === ShipMethod.VNPOST) {
    const addressStorehouseByCode = await AddressStorehouseModel.findOne({
      code: member.code,
    });

    if(!addressStorehouseByCode){
      throw Error("Không thể xác nhận đơn hàng do chưa cập nhật mã bưu cục cho địa điểm kho");
    }
    
    if (order.addressStorehouseId !== addressStorehouseByCode.id) {
      order.oldAddressStorehouseId = temp.addressStorehouseId;
      order.addressStorehouseId = addressStorehouseByCode.id;
    }
  }

  for (const orderItemId of order.itemIds) {
    await OrderItemModel.findByIdAndUpdate(
      orderItemId,
      { $set: { status: OrderStatus.CONFIRMED } },
      { new: true }
    );
  }

  order.status = OrderStatus.CONFIRMED;
  if (note) order.note = note

  return await order.save().then(async (order) => {
    onConfirmedOrder.next(order);
    return order;
  });
};

const Mutation = {
  confirmOrder,
};
export default { Mutation };


