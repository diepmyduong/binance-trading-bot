import { Subject } from "rxjs";
import {
  IOrderLog,
  OrderLogModel,
  OrderLogType,
} from "../graphql/modules/orderLog/orderLog.model";

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
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
import { onSendChatBotText } from "./onSendToChatbot.event";

export const onOrderedProduct = new Subject<IOrder>();

// tạo đơn hàng thành công
// gửi cho chủ cửa hàng
onOrderedProduct.subscribe(async (order: IOrder) => {
  const {
    buyerId,
    sellerId,
    itemIds,
    isPrimary,
    code,
    buyerName,
    fromMemberId,
  } = order;
  const [seller, customer, orderItems] = await Promise.all([
    MemberLoader.load(sellerId),
    CustomerLoader.load(buyerId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  const pageAccount = customer.pageAccounts.find(
    (p) => p.pageId == seller.fanpageId
  );
  if (pageAccount) {
    // Đơn hàng của của hàng
    SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_CUSTOMER).then(
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

  const postOrderEnabled = await SettingHelper.load(
    SettingKey.POST_CREATE_ORDER_ALERT_ENABLED
  );

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

      SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_SHOPPER).then(
        (msg) => {
          onSendChatBotText.next({
            apiKey: seller.chatbotKey,
            psids: seller.psids,
            message: msg,
            context: { seller, orderItems, order },
          });
        }
      );
    } else {
      const [seller, fromSeller, orderItems] = await Promise.all([
        MemberLoader.load(sellerId),
        MemberLoader.load(fromMemberId),
        OrderItemLoader.loadMany(itemIds),
      ]);
      SettingHelper.load(SettingKey.ORDER_PENDING_MSG_FOR_SHOPPER).then(
        (msg) => {
          onSendChatBotText.next({
            apiKey: seller.chatbotKey,
            psids: seller.psids,
            message: msg,
            context: { seller, orderItems, order },
          });
        }
      );
      SettingHelper.load(
        SettingKey.ORDER_PENDING_MSG_FOR_CROSSALE_SHOPPER
      ).then((msg) => {
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
  const {
    buyerId,
    sellerId,
    id,
    status,
  } = order;
  
  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.CREATED,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  await log.save();
});
