import { Subject } from "rxjs";

import { IOrder } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel, OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { PubSubHelper } from "../helpers/pubsub.helper";

export const onMemberDelivering = new Subject<IOrder>();

onMemberDelivering.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.MEMBER_DELIVERING,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  if (toMemberId) {
    log.toMemberId = toMemberId;
    log.type = OrderLogType.TO_MEMBER_DELIVERING;
  }

  await log.save().then((log) => {
    orderService.updateLogToOrder({ order, log });
  });
});
