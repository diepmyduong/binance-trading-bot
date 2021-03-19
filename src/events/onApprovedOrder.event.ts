import { Subject } from "rxjs";
import { CustomerCommissionLogType } from "../graphql/modules/customerCommissionLog/customerCommissionLog.model";

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
import {
  IOrder,
  OrderStatus,
  ShipMethod,
} from "../graphql/modules/order/order.model";
import { OrderItemLoader } from "../graphql/modules/orderItem/orderItem.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
import { ErrorHelper } from "../helpers/error.helper";
import {
  payCommission,
  payCustomerCommission,
  payCustomerPoint,
  payMobifoneCommission,
  paySellerPoint,
} from "./event.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";
import { AddressDeliveryModel } from "../graphql/modules/addressDelivery/addressDelivery.model";
import { StoreHouseCommissionLogModel } from "../graphql/modules/storeHouseCommissionLog/storeHouseCommissionLog.model";
import { CollaboratorModel } from "../graphql/modules/collaborator/collaborator.model";

//set lại type chứ ko bị đụng truncate thằng dòng dưới
const { RECEIVE_FROM_ORDER: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_ORDER: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_ORDER } = CommissionMobifoneLogType;

const {
  RECEIVE_COMMISSION_1_FROM_ORDER,
  RECEIVE_COMMISSION_2_FROM_ORDER,
} = CommissionLogType;
export const onApprovedOrder = new Subject<IOrder>();

// duyệt đơn thành công
// gửi cho chủ cửa hàng
onApprovedOrder.subscribe(async (order) => {
  const { buyerId, sellerId, itemIds, isPrimary } = order;
  if (!isPrimary) {
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
      SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_SHOPPER).then(
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
});

// duyệt đơn thành công
// tính điểm thưởng cho khách hàng + hoa hồng cộng tác viên
// gửi cho khách hàng
onApprovedOrder.subscribe(async (order) => {
  const {
    buyerId,
    fromMemberId,
    itemIds,
    buyerBonusPoint,
    commission2,
  } = order;

  const collaborator = await CollaboratorModel.findById(order.collaboratorId);

  const [seller, customer, orderItems] = await Promise.all([
    MemberLoader.load(fromMemberId),
    CustomerLoader.load(collaborator.customerId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  // tính hoa hồng cho khách hàng
  if (order.collaboratorId) {
    const [commissionLoging, customerUpdating] = await payCustomerCommission({
      memberId: seller.id,
      customerId: customer.id,
      type: CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER,
      currentCommission: customer.commission,
      commission: commission2,
      id: order._id,
    });
  }

  let cumulativePointCustomer: ICustomer = null;
  // Điểm thưởng cho khách hàng
  if (buyerBonusPoint) {
    if (buyerBonusPoint > 0)
      [, cumulativePointCustomer] = await payCustomerPoint({
        customerId: customer.id,
        id: order._id,
        type: CUSTOMER_TYPE,
        buyerBonusPoint,
      });
  }

  const pageAccount = customer.pageAccounts.find(
    (p) => p.pageId == seller.fanpageId
  );
  if (pageAccount) {
    // Đơn hàng của chủ shop
    SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_CUSTOMER).then(
      (msg) => {
        onSendChatBotText.next({
          apiKey: seller.chatbotKey,
          psids: [pageAccount.psid],
          message: msg,
          context: {
            seller,
            orderItems,
            order,
            commission: order.collaboratorId ? commission2 : null,
            myCommission: order.collaboratorId ? customer.commission : null,
            point: buyerBonusPoint,
            myPoint: buyerBonusPoint
              ? cumulativePointCustomer.cumulativePoint
              : null,
          },
        });
      }
    );
  }
});

// duyệt đơn thành công
// tính hoa hồng mobifone - f0 - commission0
// gửi cho mobiphone khi
onApprovedOrder.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds, commission0 } = order;
  //   console.log("order", order);
  const postOrderEnabled = SettingHelper.load(
    SettingKey.POST_CREATE_ORDER_ALERT_ENABLED
  );
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
        const commission = await payMobifoneCommission({
          type: RECEIVE_COMMISSION_0_FROM_ORDER,
          commission: commission0,
          id: order._id,
        });
      }

      // đơn hàng mobi
      const pageAccount = customer.pageAccounts.find(
        (p) => p.pageId == seller.fanpageId
      );
      if (pageAccount) {
        // Đơn hàng của Mobifone
        SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG_FOR_MOBIPHONE).then(
          (msg) => {
            onSendChatBotText.next({
              apiKey: apiKey,
              psids: users.map((u) => u.psid),
              message: msg,
              context: { seller, orderItems, order, commission: commission0 },
            });
          }
        );
      }
    }
  }
});

// duyệt đơn hàng thành công
// tính Hoa hồng điểm bán - f1 - commission1
// gửi cho cửa hàng bán chéo
onApprovedOrder.subscribe(async (order) => {
  const { fromMemberId, itemIds, commission1, sellerBonusPoint } = order;

  const [fromSeller, orderItems] = await Promise.all([
    MemberLoader.load(fromMemberId),
    OrderItemLoader.loadMany(itemIds),
  ]);

  let commissionUpdating: IMember = null;

  // console.log("commission1", commission1);
  // Hoa hồng điểm bán
  if (commission1) {
    if (commission1 > 0) {
      [, commissionUpdating] = await payCommission({
        memberId: fromSeller._id,
        type: RECEIVE_COMMISSION_1_FROM_ORDER,
        currentCommission: fromSeller.commission,
        commission: commission1,
        id: order._id,
      });
    }
  }

  let cummulativeUpdating: IMember = null;
  // Điểm thưởng điểm bán
  if (sellerBonusPoint && sellerBonusPoint > 0) {
    [, cummulativeUpdating] = await paySellerPoint({
      id: order._id,
      sellerId: fromSeller._id,
      type: SELLER_TYPE,
      sellerBonusPoint,
    });
  }

  if (fromSeller) {
    SettingHelper.load(
      SettingKey.ORDER_COMPLETED_MSG_FOR_CROSSALE_SHOPPER
    ).then((msg) => {
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
          myPoint: sellerBonusPoint
            ? cummulativeUpdating.cumulativePoint
            : null,
        },
      };
      onSendChatBotText.next(params);
    });
  }
});

// duyệt đơn hàng thành công
// Tính chiết khấu dành cho người giới thiêu
// Gửi mess cho người giới thiệu
onApprovedOrder.subscribe(async (order) => {
  const { sellerId, commission2, _id, code } = order;
  const shopper = await MemberLoader.load(sellerId);
  if (!shopper) throw ErrorHelper.mgRecoredNotFound("chủ shop");
  if (commission2) {
    if (commission2 > 0) {
      // Kiểm tra có người giới thiệu shop đó ko ?
      const presenterId = shopper.parentIds ? shopper.parentIds[0] : null;
      if (presenterId) {
        const presenter = await MemberModel.findById(presenterId);
        if (!presenter) return;

        //chi trả Hoa hồng cho người giới thiệu
        await payCommission({
          memberId: presenter._id,
          type: RECEIVE_COMMISSION_2_FROM_ORDER,
          currentCommission: presenter.commission,
          commission: commission2,
          id: _id,
        }).then((res) => {
          const commissionUpdating = res[1];
          if (presenter.psids) {
            SettingHelper.load(
              SettingKey.ORDER_COMMISSION_MSG_FOR_PRESENTER
            ).then((msg) => {
              const params = {
                apiKey: presenter.chatbotKey,
                psids: presenter.psids,
                message: msg,
                context: {
                  shopper,
                  code,
                  commission: commission2,
                  myCommission: commission2
                    ? commissionUpdating.commission
                    : null,
                },
              };
              onSendChatBotText.next(params);
            });
          }
        });
      }
    }
  }
});

// tinh hoa hồng kho
onApprovedOrder.subscribe(async (order) => {
  const { commission3, id, addressDeliveryId } = order;
  if (commission3 > 0) {
    const addressDelivery = await AddressDeliveryModel.findById(
      addressDeliveryId
    );
    const member = await MemberModel.findOne({ code: addressDelivery.code });
    const commission = new StoreHouseCommissionLogModel({
      orderId: id,
      value: commission3,
      addressDeliveryId: addressDelivery.id,
      memberId: member.id,
    });
    commission.save();
  }
});

// xac nhan don hang
// thong bao den chu shop
// thong bao den khach hang
onApprovedOrder.subscribe(async (order) => {
  const { shipMethod, addressDeliveryId } = order;
  if (shipMethod === ShipMethod.POST) {
  }
});
