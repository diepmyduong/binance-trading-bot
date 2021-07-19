import { Subject } from "rxjs";

import {
  InsertNotification,
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel, OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { PubSubHelper } from "../helpers/pubsub.helper";

export const onConfirmedOrder = new Subject<IOrder>();

onConfirmedOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.CONFIRMED,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
    toMemberId: toMemberId,
  });

  await log.save().then((log) => {
    orderService.updateLogToOrder({ order, log });
  });
});

// Gửi thông báo đơn hàng đang làm món cho khách hàng
onConfirmedOrder.subscribe(async (order) => {
  if (order.status != OrderStatus.CONFIRMED) return;
  const notify = new NotificationModel({
    target: NotificationTarget.CUSTOMER,
    type: NotificationType.ORDER,
    customerId: order.buyerId,
    title: `Đơn hàng #${order.code}`,
    body: `Món ăn đang được chuẩn bị.`,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Publish order stream
onConfirmedOrder.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
