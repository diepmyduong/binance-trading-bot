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
  const {
    buyerId,
    sellerId,
    id,
    status,
    toMemberId
  } = order;
  
  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.MEMBER_CANCELED,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  if(toMemberId){
    log.toMemberId = toMemberId;
  }

  await log.save().then(log => { orderService.updateLogToOrder({order, log}) });
});