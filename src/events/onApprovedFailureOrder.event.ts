import { Subject } from "rxjs";
import {
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { StaffModel } from "../graphql/modules/staff/staff.model";
import { PubSubHelper } from "../helpers/pubsub.helper";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";

export const onApprovedFailureOrder = new Subject<IOrder>();

onApprovedFailureOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  if (status === OrderStatus.FAILURE) {
    const log = new OrderLogModel({
      orderId: id,
      type: OrderLogType.MEMBER_FAILURE,
      memberId: sellerId,
      customerId: buyerId,
      orderStatus: status,
    });

    if (toMemberId) {
      log.toMemberId = toMemberId;
      log.type = OrderLogType.TO_MEMBER_FAILURE;
    }

    await log.save().then((log) => {
      orderService.updateLogToOrder({ order, log });
    });
  }
});

// Thông báo đơn thành công tới khách hàng
onApprovedFailureOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.CUSTOMER,
    type: NotificationType.ORDER,
    customerId: order.buyerId,
    title: `Đơn hàng hàng #${order.code}`,
    body: `Đơn hàng bị huỷ. ${order.note}`,
    orderId: order._id,
  });
  await NotificationModel.create(notify);
  await SendNotificationJob.trigger();
});

// Thông báo nhân viên đơn hàng thành công
onApprovedFailureOrder.subscribe(async (order) => {
  const staffs = await StaffModel.find({ memberId: order.sellerId, branchId: order.shopBranchId });
  const notifies = staffs.map(
    (s) =>
      new NotificationModel({
        target: NotificationTarget.STAFF,
        type: NotificationType.ORDER,
        staffId: s._id,
        title: `Đơn hàng hàng #${order.code}`,
        body: `Đơn hàng bị huỷ. ${order.note}`,
        orderId: order._id,
      })
  );
  if (notifies.length > 0) {
    await NotificationModel.insertMany(notifies);
    await SendNotificationJob.trigger(notifies.length);
  }
});

// Thông báo chủ shop đơn hàng thành công
onApprovedFailureOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.MEMBER,
    type: NotificationType.ORDER,
    staffId: order.sellerId,
    title: `Đơn hàng hàng #${order.code}`,
    body: `Đơn hàng bị huỷ. ${order.note}`,
    orderId: order._id,
  });
  await NotificationModel.create(notify);
  await SendNotificationJob.trigger();
});

// Publish order stream
onApprovedFailureOrder.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
