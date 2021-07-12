import { Subject } from "rxjs";
import {
  InsertNotification,
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";

import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { StaffModel } from "../graphql/modules/staff/staff.model";
import {
  UtilsHelper,
  VNPostCancelStatus,
  VNPostFailedStatus,
  VNPostSuccessStatus,
} from "../helpers";
import { PubSubHelper } from "../helpers/pubsub.helper";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";
import { onApprovedCompletedOrder } from "./onApprovedCompletedOrder.event";
import { onApprovedFailureOrder } from "./onApprovedFailureOrder.event";
import { onCanceledOrder } from "./onCanceledOrder.event";

export const onDelivering = new Subject<IOrder>();

// Đơn giao bị huỷ
onDelivering.subscribe(async (order) => {
  if (
    !VNPostCancelStatus.includes(order.deliveryInfo.status) ||
    order.status != OrderStatus.DELIVERING
  )
    return;
  order.status = OrderStatus.CANCELED;
  order.note = order.deliveryInfo.statusText;
  await order.save();
  onCanceledOrder.next(order);
});

// Đơn giao không thành công
onDelivering.subscribe(async (order) => {
  if (
    !VNPostFailedStatus.includes(order.deliveryInfo.status) ||
    order.status != OrderStatus.DELIVERING
  )
    return;
  order.status = OrderStatus.FAILURE;
  order.note = order.deliveryInfo.statusText;
  await order.save();
  onApprovedFailureOrder.next(order);
});

// Đơn giao thành công
onDelivering.subscribe(async (order) => {
  if (
    !VNPostSuccessStatus.includes(order.deliveryInfo.status) ||
    order.status != OrderStatus.DELIVERING
  )
    return;
  order.status = OrderStatus.COMPLETED;
  order.note = order.deliveryInfo.statusText;
  await order.save();
  onApprovedCompletedOrder.next(order);
});

// Thông báo khách hàng cập nhật trạng thái giao hàng
onDelivering.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.CUSTOMER,
    type: NotificationType.ORDER,
    customerId: order.buyerId,
    title: `Đơn hàng #${order.code}`,
    body: order.deliveryInfo.statusText,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Thông báo nhân viên cập nhật trang thái giao hàng
onDelivering.subscribe(async (order) => {
  const staffs = await StaffModel.find({ memberId: order.sellerId, branchId: order.shopBranchId });
  const notifies = staffs.map(
    (s) =>
      new NotificationModel({
        target: NotificationTarget.STAFF,
        type: NotificationType.ORDER,
        staffId: s._id,
        title: `Đơn hàng #${order.code}`,
        body: order.deliveryInfo.statusText,
        orderId: order._id,
      })
  );
  if (notifies.length > 0) {
    InsertNotification(notifies);
  }
});

// Thông báo chủ shop cập nhật trạng thái giao hàng
onDelivering.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.MEMBER,
    type: NotificationType.ORDER,
    staffId: order.sellerId,
    title: `Đơn hàng #${order.code}`,
    body: order.deliveryInfo.statusText,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Publish order stream
onDelivering.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
