import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CommissionLogType } from "../graphql/modules/commissionLog/commissionLog.model";
import { CommissionMobifoneLogType } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { CumulativePointLogType } from "../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import { CustomerLoader, CustomerModel, ICustomer } from "../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import { IMember, MemberLoader, MemberModel } from "../graphql/modules/member/member.model";
import { IRegisSMS, RegisSMSStatus } from "../graphql/modules/regisSMS/regisSMS.model";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { UserModel } from "../graphql/modules/user/user.model";
import { ErrorHelper } from "../helpers/error.helper";
import {
  payCommission,
  payCustomerPoint,
  payMobifoneCommission,
  paySellerPoint,
} from "./event.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";

//set lại type chứ ko bị đụng truncate thằng dòng dưới
const { RECEIVE_FROM_REGIS_SMS: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_REGIS_SMS: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_SMS } = CommissionMobifoneLogType;

const { RECEIVE_COMMISSION_1_FROM_SMS, RECEIVE_COMMISSION_2_FROM_SMS } = CommissionLogType;

export const onApprovedSMS = new Subject<IRegisSMS>();


// Duyệt sms thành công
// Tính chiết khấu cho mobifone - commission0
// Gửi messenger cho mobifone
onApprovedSMS.subscribe(async (sms) => {
  const { sellerId, code, registerName, commission0 } = sms;

  const [seller, apiKey, msg, users] = await Promise.all([
    MemberLoader.load(sellerId),
    SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    SettingHelper.load(SettingKey.SMS_COMPLETED_MSG_FOR_MOBIFONE),
    UserModel.find({ psid: { $exists: true } }),
  ]);

  if (commission0) {
    if (commission0 > 0) {
      await payMobifoneCommission({
        type: RECEIVE_COMMISSION_0_FROM_SMS,
        commission: commission0,
        id: sms._id
      });
    }
  }


  onSendChatBotText.next({
    apiKey: apiKey,
    psids: users.map((u) => u.psid),
    message: msg,
    context: { seller, code, registerName, commission: commission0 },
  });
});

// Duyệt sms thành công 
// Điểm thưởng cho khách hàng
// Gửi messenger cho customer
onApprovedSMS.subscribe(async (sms) => {
  const { registerId, sellerId, basePrice, code, buyerBonusPoint } = sms;
  const [seller, customer] = await Promise.all([
    MemberLoader.load(sellerId),
    CustomerLoader.load(registerId),
  ]);

  let cummulativeUpdating: ICustomer = null
  // Điểm thưởng cho khách hàng
  if (buyerBonusPoint) {
    if (buyerBonusPoint > 0) {
      [, cummulativeUpdating] = await payCustomerPoint({
        customerId: registerId,
        id: sms._id,
        type: CUSTOMER_TYPE,
        buyerBonusPoint,
      });
    }
  }

  const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
  if (pageAccount) {
    SettingHelper.load(SettingKey.SMS_COMPLETED_MSG_FOR_CUSTOMER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: [pageAccount.psid],
        message: msg,
        context: {
          value: basePrice,
          code,
          point: buyerBonusPoint,
          myPoint: cummulativeUpdating ? cummulativeUpdating.cumulativePoint : null
        },
      });
    });
  }
});

// Duyệt sms thành công
// Tính chiết khấu
// Tính điểm thưởng cho người bán
// Gửi messenger cho người bán
onApprovedSMS.subscribe(async (sms) => {
  const { _id, sellerId, commission1, code, registerName, registerId, sellerBonusPoint }: IRegisSMS = sms;

  const seller = await MemberModel.findById(sellerId);
  if (!seller)
    return;


  let commissionUpdating: IMember = null;
  if (commission1) {
    if (commission1 > 0) {
      [, commissionUpdating] = await payCommission({
        memberId: seller._id,
        type: RECEIVE_COMMISSION_1_FROM_SMS,
        currentCommission: seller.commission,
        commission: commission1,
        id: _id,
      });
    }
  }

  let cummulativeUpdating: IMember = null;
  console.log('======> go to assdjkfgskdhbgksjhdg', sellerBonusPoint);
  if (sellerBonusPoint) {
    if (sellerBonusPoint > 0) {
      const payPoints = await paySellerPoint({
        sellerId,
        id: sms._id,
        type: SELLER_TYPE,
        sellerBonusPoint
      });
      // console.log('payPoints', payPoints);
      cummulativeUpdating = payPoints[1];
    }
  }

  if (seller.psids) {
    SettingHelper.load(SettingKey.SMS_COMPLETED_MSG_FOR_SELLER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: seller.psids,
        message: msg,
        context: {
          code,
          registerName,
          commission: commission1,
          myCommission: commission1 ? commissionUpdating.commission : null,
          point: sellerBonusPoint,
          myPoint: cummulativeUpdating ? cummulativeUpdating.cumulativePoint : null
        },
      });
    });
  }
});

// Duyệt sms thành công
// Tính chiết khấu cho người giới thiệu
// Gửi messenger cho người giới thiệu
onApprovedSMS.subscribe(async (sms) => {
  const { _id, sellerId, commission2, code }: any = sms;
  if (commission2 > 0) {
    const seller = await MemberModel.findById(sellerId);
    if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

    // kiem tra co parentIds ko ? neu co lay index = 0
    const presenterId = seller.parentIds ? seller.parentIds[0] : null;
    console.log('presenterId', presenterId);
    if (presenterId) {
      const presenter = await MemberModel.findById(presenterId);
      if (!presenter)
        return;

      console.log('presenter', presenter);

      await payCommission({
        memberId: presenter._id,
        type: RECEIVE_COMMISSION_2_FROM_SMS,
        currentCommission: presenter.commission,
        commission: commission2,
        id: _id,
      }).then((res) => {
        const commissionUpdating = res[1];
        console.log('presenter.psids', presenter.psids);
        if (presenter.psids) {
          SettingHelper.load(SettingKey.SMS_COMMISSION_MSG_FOR_PRESENTER).then((msg) => {
            onSendChatBotText.next({
              apiKey: presenter.chatbotKey,
              psids: presenter.psids,
              message: msg,
              context: {
                code,
                shopper: seller,
                commission: commission2,
                myCommission: commission2 ? commissionUpdating.commission : null
              },
            });
          });
        }
      });
    }
  }
});
