import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CollaboratorModel } from "../graphql/modules/collaborator/collaborator.model";
import { CommissionLogType } from "../graphql/modules/commissionLog/commissionLog.model";
import { CommissionMobifoneLogType } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { CumulativePointLogType } from "../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import {
  CustomerLoader,
  CustomerModel,
  ICustomer,
} from "../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import { IMember, MemberLoader, MemberModel } from "../graphql/modules/member/member.model";
import {
  InsertNotification,
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../graphql/modules/notification/notification.model";
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { OrderLogModel, OrderLogType } from "../graphql/modules/orderLog/orderLog.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { StaffModel, StaffScope } from "../graphql/modules/staff/staff.model";
import { staffService } from "../graphql/modules/staff/staff.service";
import { UserModel } from "../graphql/modules/user/user.model";
import { PubSubHelper } from "../helpers/pubsub.helper";
import SendNotificationJob from "../scheduler/jobs/sendNotification.job";
import { EventHelper } from "./event.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";

export const onApprovedCompletedOrder = new Subject<IOrder>();

// duyệt đơn thành công
// gửi cho chủ cửa hàng
onApprovedCompletedOrder.subscribe(async (order) => {
  const { buyerId, sellerId, itemIds, isPrimary } = order;
  if (!isPrimary) {
    const [seller, customer, orderItems] = await Promise.all([
      MemberLoader.load(sellerId),
      CustomerLoader.load(buyerId),
      OrderItemLoader.loadMany(itemIds),
    ]);
    const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
    if (pageAccount) {
      // Đơn hàng của của hàng
      SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_SHOPPER).then((msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: seller.psids,
          message: msg,
          context: { seller, orderItems, order },
        });
      });
    }
  }
});

// duyệt đơn thành công
// gửi cho khách hàng
onApprovedCompletedOrder.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds, buyerBonusPoint, collaboratorId } = order;

  const collaborator = await CollaboratorModel.findById(collaboratorId);

  const [seller, customer, orderItems] = await Promise.all([
    MemberLoader.load(fromMemberId),
    CustomerLoader.load(buyerId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  let cumulativePointCustomer: ICustomer = null;
  // Điểm thưởng cho khách hàng
  if (collaborator) {
    if (collaborator.customerId === customer.id) {
      if (buyerBonusPoint) {
        if (buyerBonusPoint > 0)
          [, cumulativePointCustomer] = await EventHelper.payCustomerPoint({
            customerId: customer.id,
            id: order._id,
            type: CustomerPointLogType.RECEIVE_FROM_ORDER,
            buyerBonusPoint,
          });
      }
    }
  }
  const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
  if (pageAccount) {
    // Đơn hàng của chủ shop
    SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_CUSTOMER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: [pageAccount.psid],
        message: msg,
        context: {
          seller,
          orderItems,
          order,
          point: buyerBonusPoint,
          myPoint: buyerBonusPoint ? cumulativePointCustomer.cumulativePoint : null,
        },
      });
    });
  }
});

// duyệt đơn thành công
// tính hoa hồng mobifone - f0 - commission0
// gửi cho mobiphone khi
onApprovedCompletedOrder.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds, commission0 } = order;
  //   console.log("order", order);
  const postOrderEnabled = SettingHelper.load(SettingKey.POST_CREATE_ORDER_ALERT_ENABLED);
  if (postOrderEnabled) {
    if (order.isPrimary) {
      const [seller, customer, orderItems, users, apiKey] = await Promise.all([
        MemberLoader.load(fromMemberId),
        CustomerLoader.load(buyerId),
        OrderItemLoader.loadMany(itemIds),
        UserModel.find({ psid: { $exists: true } }),
        SettingHelper.load(SettingKey.CHATBOT_API_KEY),
      ]);

      // hoa hồng mobiphone
      if (commission0 > 0) {
        await EventHelper.payMobifoneCommission({
          type: CommissionMobifoneLogType.RECEIVE_COMMISSION_0_FROM_ORDER,
          commission: commission0,
          id: order._id,
        });
      }

      // đơn hàng mobi
      const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
      if (pageAccount) {
        // Đơn hàng của Mobifone
        SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_MOBIPHONE).then((msg) => {
          onSendChatBotText.next({
            apiKey: apiKey,
            psids: users.map((u) => u.psid),
            message: msg,
            context: { seller, orderItems, order, commission: commission0 },
          });
        });
      }
    }
  }
});

// duyệt đơn hàng thành công
// tính Hoa hồng điểm bán - f1 - commission1
// gửi cho cửa hàng bán chéo
onApprovedCompletedOrder.subscribe(async (order) => {
  const { fromMemberId, itemIds, commission1, sellerBonusPoint, sellerId } = order;

  const [fromSeller, orderItems] = await Promise.all([
    MemberModel.findById(fromMemberId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  let commissionUpdating: IMember = null;

  // console.log("commission1", commission1);
  // Hoa hồng điểm bán
  if (commission1) {
    if (commission1 > 0) {
      [, commissionUpdating] = await EventHelper.payCommission({
        memberId: fromSeller._id,
        type: CommissionLogType.RECEIVE_COMMISSION_1_FROM_ORDER,
        currentCommission: fromSeller.commission,
        commission: commission1,
        id: order._id,
      });
    }
  }

  let cummulativeUpdating: IMember = null;
  // Điểm thưởng điểm bán
  if (sellerBonusPoint && sellerBonusPoint > 0) {
    [, cummulativeUpdating] = await EventHelper.paySellerPoint({
      id: order._id,
      sellerId: fromSeller._id,
      type: CumulativePointLogType.RECEIVE_FROM_ORDER,
      sellerBonusPoint,
    });
  }

  if (fromSeller) {
    SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_CROSSALE_SHOPPER).then((msg) => {
      const params = {
        apiKey: fromSeller.chatbotKey,
        psids: fromSeller.psids,
        message: msg,
        context: {
          seller: fromSeller,
          orderItems,
          order,
          commission: commission1,
          myCommission: commission1 ? commissionUpdating.commission : null,
          point: sellerBonusPoint,
          myPoint: sellerBonusPoint ? cummulativeUpdating.cumulativePoint : null,
        },
      };
      onSendChatBotText.next(params);
    });
  }
});

// duyệt đơn hàng thành công
// Tính chiết khấu dành cho người giới thiêu  - f2 - commission2
// Gửi mess cho người giới thiệu
onApprovedCompletedOrder.subscribe(async (order) => {
  const { fromMemberId, commission2, id, code, collaboratorId } = order;
  if (commission2 <= 0) return;
  const [fromSeller, collaborator] = await Promise.all([
    MemberModel.findById(fromMemberId),
    CollaboratorModel.findById(collaboratorId),
  ]);
  if (!fromSeller) return;
  if (collaborator) {
    const customerPresenter = await CustomerModel.findById(collaborator.customerId);
    await EventHelper.payCollaboratorCommission({
      customerId: customerPresenter.id,
      memberId: fromSeller._id,
      commission: commission2,
      currentCommission: customerPresenter.commission,
      collaboratorId,
      id,
    });
  } else {
    const commissionResult = await EventHelper.payCommission({
      memberId: fromSeller._id,
      type: CommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER_FOR_COLLABORATOR,
      currentCommission: fromSeller.commission,
      commission: commission2,
      id,
    });
    const [, receiver] = commissionResult;
    if (fromSeller.psids) {
      SettingHelper.load(SettingKey.ORDER_COMMISSION_MSG_FOR_PRESENTER).then((msg) => {
        const params = {
          apiKey: fromSeller.chatbotKey,
          psids: fromSeller.psids,
          message: msg,
          context: {
            shopper: fromSeller,
            code,
            commission: commission2,
            myCommission: commission2 ? receiver.commission : null,
          },
        };
        onSendChatBotText.next(params);
      });
    }
  }
});

// duyệt đơn hàng thành công
// Tính chiết khấu dành cho kho giao hàng  - f3 - commission3
// Gửi mess cho người giới thiệu
onApprovedCompletedOrder.subscribe(async (order) => {
  const { commission3, id, toMemberId, sellerId, code } = order;
  if (commission3 <= 0) return;
  const [seller, toMember] = await Promise.all([
    MemberModel.findById(sellerId),
    MemberModel.findById(toMemberId || sellerId),
  ]);
  if (!seller || !toMember) return;
  const commissionResult = await EventHelper.payCommission({
    memberId: toMember._id,
    type: CommissionLogType.RECEIVE_COMMISSION_3_FROM_ORDER,
    currentCommission: toMember.commission,
    commission: commission3,
    id,
  });

  const [, receiver] = commissionResult;
  if (toMember.psids) {
    SettingHelper.load(SettingKey.ORDER_COMMISSION_MSG_FOR_PRESENTER).then((msg) => {
      const params = {
        apiKey: toMember.chatbotKey,
        psids: toMember.psids,
        message: msg,
        context: {
          shopper: seller,
          code,
          commission: commission3,
          myCommission: commission3 ? receiver.commission : null,
        },
      };
      onSendChatBotText.next(params);
    });
  }
});

// Ghi log
onApprovedCompletedOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  if (status === OrderStatus.COMPLETED) {
    const log = new OrderLogModel({
      orderId: id,
      type: OrderLogType.MEMBER_COMPLETED,
      memberId: sellerId,
      customerId: buyerId,
      orderStatus: status,
    });

    if (toMemberId) {
      log.toMemberId = toMemberId;
      log.type = OrderLogType.TO_MEMBER_COMPLETED;
    }

    await log.save().then((log) => {
      orderService.updateLogToOrder({ order, log });
    });
  }
});

// Thông báo đơn thành công tới khách hàng
onApprovedCompletedOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.CUSTOMER,
    type: NotificationType.ORDER,
    customerId: order.buyerId,
    title: `Đơn hàng #${order.code}`,
    body: `Đơn hàng hoàn thành.`,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Thông báo nhân viên đơn hàng thành công
onApprovedCompletedOrder.subscribe(async (order) => {
  const staffs = await staffService.getStaffByBranchAndScope(order.sellerId, order.shopBranchId);
  const notifies = staffs.map(
    (s) =>
      new NotificationModel({
        target: NotificationTarget.STAFF,
        type: NotificationType.ORDER,
        staffId: s._id,
        title: `Đơn hàng #${order.code}`,
        body: `Đơn hàng hoàn thành`,
        orderId: order._id,
      })
  );
  if (notifies.length > 0) {
    InsertNotification(notifies);
  }
});

// Thông báo chủ shop đơn hàng thành công
onApprovedCompletedOrder.subscribe(async (order) => {
  const notify = new NotificationModel({
    target: NotificationTarget.MEMBER,
    type: NotificationType.ORDER,
    staffId: order.sellerId,
    title: `Đơn hàng #${order.code}`,
    body: `Đơn hàng hoàn thành`,
    orderId: order._id,
  });
  InsertNotification([notify]);
});

// Publish order stream
onApprovedCompletedOrder.subscribe(async (order) => {
  PubSubHelper.publish("order", order);
});
