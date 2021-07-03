import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CustomerLoader } from "../graphql/modules/customer/customer.model";
import { MemberLoader, MemberModel } from "../graphql/modules/member/member.model";
import {
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { OrderLogModel, OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { StaffModel } from "../graphql/modules/staff/staff.model";
import { UserModel } from "../graphql/modules/user/user.model";
import { UtilsHelper } from "../helpers";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";
import { onSendChatBotText } from "./onSendToChatbot.event";

export const onOrderedProduct = new Subject<IOrder>();

// tạo đơn hàng thành công
// gửi cho chủ cửa hàng
onOrderedProduct.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, itemIds, isPrimary, code, buyerName, fromMemberId } = order;
  const [seller, customer, orderItems] = await Promise.all([
    MemberLoader.load(sellerId),
    CustomerLoader.load(buyerId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
  if (pageAccount) {
    // Đơn hàng của của hàng
    SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_CUSTOMER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: [pageAccount.psid],
        message: msg,
        context: { seller, orderItems, order },
      });
    });
  }

  const postOrderEnabled = await SettingHelper.load(SettingKey.POST_CREATE_ORDER_ALERT_ENABLED);

  // console.log('postOrderEnabled',postOrderEnabled);

  if (isPrimary) {
    if (postOrderEnabled) {
      const [apiKey, msg, users, orderItems] = await Promise.all([
        SettingHelper.load(SettingKey.CHATBOT_API_KEY),
        SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_MOBIFONE),
        UserModel.find({ psid: { $exists: true } }),
        OrderItemLoader.loadMany(order.itemIds),
      ]);

      onSendChatBotText.next({
        apiKey: apiKey,
        psids: users.map((u) => u.psid),
        message: msg,
        context: { order, orderItems },
      });
    }
  } else {
    if (fromMemberId.toString() === sellerId.toString()) {
      const [seller, orderItems] = await Promise.all([
        MemberLoader.load(sellerId),
        OrderItemLoader.loadMany(itemIds),
      ]);

      SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_SHOPPER).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: seller.psids,
          message: msg,
          context: { seller, orderItems, order },
        });
      });
    } else {
      const [seller, fromSeller, orderItems] = await Promise.all([
        MemberLoader.load(sellerId),
        MemberLoader.load(fromMemberId),
        OrderItemLoader.loadMany(itemIds),
      ]);
      SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_SHOPPER).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: seller.psids,
          message: msg,
          context: { seller, orderItems, order },
        });
      });
      SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: seller.psids,
          message: msg,
          context: { seller: fromSeller, orderItems, order },
        });
      });
    }
  }
});

onOrderedProduct.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status } = order;

  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.CREATED,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  await log.save().then((log) => {
    orderService.updateLogToOrder({ order, log });
  });
});

// Gửi thông báo tới nhân viên chi nhánh
onOrderedProduct.subscribe(async (order) => {
  if (order.status != OrderStatus.PENDING) return;
  const staffs = await StaffModel.find({ memberId: order.sellerId, branchId: order.shopBranchId });
  const notifies = staffs.map(
    (s) =>
      new NotificationModel({
        target: NotificationTarget.STAFF,
        type: NotificationType.ORDER,
        staffId: s._id,
        title: `Đơn hàng mới #${order.code}`,
        body: `${order.itemCount} món - ${UtilsHelper.toMoney(order.amount)}`,
        orderId: order._id,
      })
  );
  if (notifies.length > 0) {
    await NotificationModel.insertMany(notifies);
    await SendNotificationJob.trigger(notifies.length);
  }
});

// Gửi thông báo tới chủ shop
onOrderedProduct.subscribe(async (order) => {
  if (order.status != OrderStatus.PENDING) return;
  const member = await MemberModel.findById(order.sellerId);
  const notify = new NotificationModel({
    target: NotificationTarget.MEMBER,
    type: NotificationType.ORDER,
    memberId: member._id,
    title: `Đơn hàng mới #${order.code}`,
    body: `${order.itemCount} món - ${UtilsHelper.toMoney(order.amount)}`,
    orderId: order._id,
  });
  await NotificationModel.create(notify);
  await SendNotificationJob.trigger();
});
