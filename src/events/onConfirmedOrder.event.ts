import { Subject } from "rxjs";
import { IOrder, ShipMethod } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";

export const onConfirmedOrder = new Subject<IOrder>();

onConfirmedOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

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

  await log.save().then((log) => {
    orderService.updateLogToOrder({ order, log });
  });
});
