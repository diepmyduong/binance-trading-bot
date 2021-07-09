import { Subject } from "rxjs";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";

import { SettingKey } from "../configs/settingData";
import { CustomerLoader } from "../graphql/modules/customer/customer.model";
import { MemberLoader } from "../graphql/modules/member/member.model";
import { IOrder } from "../graphql/modules/order/order.model";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
import { onSendChatBotText } from "./onSendToChatbot.event";
import { orderService } from "../graphql/modules/order/order.service";
import {
  InsertNotification,
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { StaffModel } from "../graphql/modules/staff/staff.model";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";
import { PubSubHelper } from "../helpers/pubsub.helper";

export const onCanceledOrder = new Subject<IOrder>();

// Gửi thông báo tới khách hàng
onCanceledOrder.subscribe(async (order) => {
  const [seller, customer, orderItems] = await Promise.all([
    MemberLoader.load(order.fromMemberId),
    CustomerLoader.load(order.buyerId),
    OrderItemLoader.loadMany(order.itemIds),
  ]);
  const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
  if (pageAccount) {
    if (order.isPrimary) {
      // Đơn hàng của Mobifone
      SettingHelper.load(SettingKey.ORDER_CANCELED_CUSTOMER_MOBI_MSG).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: [pageAccount.psid],
          message: msg,
          context: { seller, orderItems, order },
        });
      });
    } else {
      // Đơn hàng của chủ shop
      SettingHelper.load(SettingKey.ORDER_CANCELED_CUSTOMER_MSG).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: [pageAccount.psid],
          message: msg,
          context: { seller, orderItems, order },
        });
      });
    }
  }
});

// Gửi thông báo tới chủ shop
onCanceledOrder.subscribe(async (order) => {
  const [seller, orderItems] = await Promise.all([
    MemberLoader.load(order.fromMemberId),
    OrderItemLoader.loadMany(order.itemIds),
  ]);
  if (order.isPrimary || order.sellerId.toString() != order.fromMemberId.toString()) {
    // Đơn hàng của Mobifone hoặc bán chéo
    SettingHelper.load(SettingKey.ORDER_CANCELED_SELLER_CROSSSALE_MSG).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: seller.psids,
        message: msg,
        context: { seller, orderItems, order },
      });
    });
  } else {
    // Đơn hàng tự bán
    SettingHelper.load(SettingKey.ORDER_CANCELED_SELLER_MSG).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: seller.psids,
        message: msg,
        context: { seller, orderItems, order },
      });
    });
  }
});

// Gửi thông báo tới quản trị viên Mobifone
onCanceledOrder.subscribe(async (order) => {
  if (!order.isPrimary) return;
  const [seller, orderItems, apiKey, msg, users] = await Promise.all([
    MemberLoader.load(order.fromMemberId),
    OrderItemLoader.loadMany(order.itemIds),
    SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    SettingHelper.load(SettingKey.ORDER_CANCELED_SELLER_CROSSSALE_MSG),
    UserModel.find({ psid: { $exists: true } }),
  ]);
  onSendChatBotText.next({
    apiKey: apiKey,
    psids: users.map((u) => u.psid),
    message: msg,
    context: { seller, orderItems, order },
  });
});

onCanceledOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.MEMBER_CANCELED,
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

// Thông báo khách hàng cập nhật trạng thái giao hàng
onCanceledOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.CUSTOMER,
    type: NotificationType.ORDER,
    customerId: order.buyerId,
    title: `Đơn hàng #${order.code}`,
    body: `Đơn hàng đã huỷ`,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Thông báo nhân viên cập nhật trang thái giao hàng
onCanceledOrder.subscribe(async (order) => {
  const staffs = await StaffModel.find({ memberId: order.sellerId, branchId: order.shopBranchId });
  const notifies = staffs.map(
    (s) =>
      new NotificationModel({
        target: NotificationTarget.STAFF,
        type: NotificationType.ORDER,
        staffId: s._id,
        title: `Đơn hàng #${order.code}`,
        body: `Đơn hàng đã huỷ`,
        orderId: order._id,
      })
  );
  if (notifies.length > 0) {
    InsertNotification(notifies);
  }
});

// Thông báo chủ shop cập nhật trạng thái giao hàng
onCanceledOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.MEMBER,
    type: NotificationType.ORDER,
    staffId: order.sellerId,
    title: `Đơn hàng #${order.code}`,
    body: `Đơn hàng đã huỷ`,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Publish order stream
onCanceledOrder.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
