import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CommissionLogType } from "../graphql/modules/commissionLog/commissionLog.model";
import { CommissionMobifoneLogType } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { CumulativePointLogType } from "../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import {
  CustomerLoader,
  CustomerModel,
  ICustomer,
} from "../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import {
  IMember,
  MemberLoader,
  MemberModel,
} from "../graphql/modules/member/member.model";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
import { ErrorHelper } from "../helpers/error.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";
import { IOrder, OrderModel, OrderStatus, PaymentMethod } from "../graphql/modules/order/order.model";
import {
  VietnamPostHelper,
  GetOrderStatus,
  DeliveryStatus,
  GetOrderStatusByPostDeliveryStatus,
} from "../helpers";

export const onDelivering = new Subject<IOrder>();
//set lại type chứ ko bị đụng truncate thằng dòng dướ

// gửi thông báo cho khách hàng 3 tình trạng đơn hàng - đang giao - giao thành công - giao thất bại
onDelivering.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds , deliveryInfo} = order;

  // console.log("onDelivering order", order);
  const alert = await SettingHelper.load(
    SettingKey.DELIVERY_STATUS_CUSTOMER_ALERT
  );
  //   console.log("order", order);
  if (alert) {
    const [seller, customer, orderItems, users, apiKey] = await Promise.all([
      MemberLoader.load(fromMemberId),
      CustomerLoader.load(buyerId),
      OrderItemLoader.loadMany(itemIds),
      UserModel.find({ psid: { $exists: true } }),
      SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    ]);

    // đơn hàng mobi
    const pageAccount = customer.pageAccounts.find(
      (p) => p.pageId == seller.fanpageId
    );

    // console.log('pageAccount',pageAccount);
    if (pageAccount) {
      // Đơn hàng của Mobifone
      const status = GetOrderStatusByPostDeliveryStatus(
        deliveryInfo.status
      );
      console.log("status", status);
      if (status === DeliveryStatus.DELIVERING) {
        SettingHelper.load(SettingKey.DELIVERY_PENDING_MSG_FOR_CUSTOMER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: [pageAccount.psid],
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
      if (status === DeliveryStatus.FAILURE) {
        SettingHelper.load(SettingKey.DELIVERY_FAILURE_MSG_FOR_CUSTOMER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: [pageAccount.psid],
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
      if (status === DeliveryStatus.COMPLETED) {
        SettingHelper.load(SettingKey.DELIVERY_COMPLETED_MSG_FOR_CUSTOMER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: [pageAccount.psid],
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
    }
  }
});

// gửi thông tin cho chủ shop 3 trạng thái đơn hàng
onDelivering.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds } = order;

  // console.log("onDelivering order", order);
  const alert = await SettingHelper.load(
    SettingKey.DELIVERY_STATUS_MEMBER_ALERT
  );
  //   console.log("order", order);
  if (alert) {
    const [seller, customer, orderItems, users, apiKey] = await Promise.all([
      MemberLoader.load(fromMemberId),
      CustomerLoader.load(buyerId),
      OrderItemLoader.loadMany(itemIds),
      UserModel.find({ psid: { $exists: true } }),
      SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    ]);

    // đơn hàng mobi
    const pageAccount = customer.pageAccounts.find(
      (p) => p.pageId == seller.fanpageId
    );

    // console.log('pageAccount',pageAccount);
    if (pageAccount) {
      // Đơn hàng của Mobifone
      const status = GetOrderStatusByPostDeliveryStatus(
        order.deliveryInfo.status
      );

      if (status === DeliveryStatus.DELIVERING) {
        SettingHelper.load(SettingKey.DELIVERY_PENDING_MSG_FOR_MEMBER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: seller.psids,
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
      if (status === DeliveryStatus.FAILURE) {
        SettingHelper.load(SettingKey.DELIVERY_FAILURE_MSG_FOR_MEMBER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: seller.psids,
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
      if (status === DeliveryStatus.COMPLETED) {
        SettingHelper.load(SettingKey.DELIVERY_COMPLETED_MSG_FOR_MEMBER).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: seller.chatbotKey,
              psids: seller.psids,
              message: msg,
              context: { seller, orderItems, order },
            });
          }
        );
      }
    }
  }
});

// chuyen trang thai PROCESSING san DELIVERING
onDelivering.subscribe(async (order) => {
  const { deliveryInfo,paymentMethod } = order;
  const cod  = paymentMethod === PaymentMethod.COD
  if (deliveryInfo) {
    const status = GetOrderStatus(deliveryInfo.status ,cod);
    if(status){
      if ([OrderStatus.DELIVERING, OrderStatus.RETURNED].includes(status)) {
        OrderModel.findByIdAndUpdate(order.id, {$set:{
          status
        }});
      }
      if(status === OrderStatus.COMPLETED){
        const autoApproveOrder =  await SettingHelper.load(SettingKey.DELIVERY_ENABLED_AUTO_APPROVE_ORDER);
        if(autoApproveOrder){
          OrderModel.findByIdAndUpdate(order.id, {$set:{
            status
          }});
        }
      }
    }
  }
});
