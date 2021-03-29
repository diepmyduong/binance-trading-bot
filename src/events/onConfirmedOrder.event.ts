import { Subject } from "rxjs";
import { IOrder, ShipMethod } from "../graphql/modules/order/order.model";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";


export const onConfirmedOrder = new Subject<IOrder>();

// xac nhan don hang 
// thong bao den chu shop
// thong bao den khach hang
onConfirmedOrder.subscribe(async (order) => {
  const { shipMethod, addressDeliveryId } = order;
  if (shipMethod === ShipMethod.POST) {

  }
});

onConfirmedOrder.subscribe(async (order: IOrder) => {
  const {
    buyerId,
    sellerId,
    id,
    status,
    toMemberId
  } = order;

  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.CONFIRMED,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  if (toMemberId) {
    log.toMemberId = toMemberId;
  }

  await log.save();
});