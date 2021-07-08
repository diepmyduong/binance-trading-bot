import { Subject } from "rxjs";
import { MemberModel } from "../graphql/modules/member/member.model";
import {
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { IOrder, OrderStatus, ShipMethod } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { UtilsHelper } from "../helpers";
import { PubSubHelper } from "../helpers/pubsub.helper";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";

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
  await NotificationModel.create(notify);
  await SendNotificationJob.trigger();
});

// Publish order stream
onConfirmedOrder.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
