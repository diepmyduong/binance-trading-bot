import { Subject } from "rxjs";

import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { VNPostCancelStatus, VNPostFailedStatus, VNPostSuccessStatus } from "../helpers";
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

// // gửi thông báo cho khách hàng 3 tình trạng đơn hàng - đang giao - giao thành công - giao thất bại
// onDelivering.subscribe(async (order) => {
//   const { buyerId, fromMemberId, itemIds, deliveryInfo } = order;

//   // console.log("onDelivering order", order);
//   const alert = await SettingHelper.load(SettingKey.DELIVERY_STATUS_CUSTOMER_ALERT);
//   //   console.log("order", order);
//   if (alert) {
//     const [seller, customer, orderItems, users, apiKey] = await Promise.all([
//       MemberLoader.load(fromMemberId),
//       CustomerLoader.load(buyerId),
//       OrderItemLoader.loadMany(itemIds),
//       UserModel.find({ psid: { $exists: true } }),
//       SettingHelper.load(SettingKey.CHATBOT_API_KEY),
//     ]);

//     // đơn hàng mobi
//     const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);

//     // console.log('pageAccount',pageAccount);
//     if (pageAccount) {
//       const status = GetOrderStatusByPostDeliveryStatus(deliveryInfo.status);
//       if (status === DeliveryStatus.DELIVERING) {
//         SettingHelper.load(SettingKey.DELIVERY_PENDING_MSG_FOR_CUSTOMER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: [pageAccount.psid],
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//       if (status === DeliveryStatus.FAILURE) {
//         SettingHelper.load(SettingKey.DELIVERY_FAILURE_MSG_FOR_CUSTOMER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: [pageAccount.psid],
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//       if (status === DeliveryStatus.COMPLETED) {
//         SettingHelper.load(SettingKey.DELIVERY_COMPLETED_MSG_FOR_CUSTOMER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: [pageAccount.psid],
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//     }
//   }
// });

// // gửi thông tin cho chủ shop 3 trạng thái đơn hàng
// onDelivering.subscribe(async (order) => {
//   const { buyerId, fromMemberId, itemIds } = order;

//   // console.log("onDelivering order", order);
//   const alert = await SettingHelper.load(SettingKey.DELIVERY_STATUS_MEMBER_ALERT);
//   //   console.log("order", order);
//   if (alert) {
//     const [seller, customer, orderItems, users, apiKey] = await Promise.all([
//       MemberLoader.load(fromMemberId),
//       CustomerLoader.load(buyerId),
//       OrderItemLoader.loadMany(itemIds),
//       UserModel.find({ psid: { $exists: true } }),
//       SettingHelper.load(SettingKey.CHATBOT_API_KEY),
//     ]);

//     // đơn hàng mobi
//     const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);

//     // console.log('pageAccount',pageAccount);
//     if (pageAccount) {
//       // Đơn hàng của Mobifone
//       const status = GetOrderStatusByPostDeliveryStatus(order.deliveryInfo.status);

//       if (status === DeliveryStatus.DELIVERING) {
//         SettingHelper.load(SettingKey.DELIVERY_PENDING_MSG_FOR_MEMBER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: seller.psids,
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//       if (status === DeliveryStatus.FAILURE) {
//         SettingHelper.load(SettingKey.DELIVERY_FAILURE_MSG_FOR_MEMBER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: seller.psids,
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//       if (status === DeliveryStatus.COMPLETED) {
//         SettingHelper.load(SettingKey.DELIVERY_COMPLETED_MSG_FOR_MEMBER).then((msg) => {
//           onSendChatBotText.next({
//             apiKey: seller.chatbotKey,
//             psids: seller.psids,
//             message: msg,
//             context: { seller, orderItems, order },
//           });
//         });
//       }
//     }
//   }
// });

// // chuyen trang thai COMPLETE hoac RETURNED
// onDelivering.subscribe(async (order) => {
//   const { deliveryInfo, paymentMethod } = order;

//   const status = GetOrderStatus(deliveryInfo.status);

//   // console.log("status", status);
//   if (status) {
//     await OrderModel.findByIdAndUpdate(
//       order.id,
//       {
//         $set: {
//           status,
//         },
//       },
//       { new: true }
//     );
//   }
// });
