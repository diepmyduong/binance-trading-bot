import { Subject } from "rxjs";

import { SettingKey } from "../configs/settingData";
import { CommissionLogType } from "../graphql/modules/commissionLog/commissionLog.model";
import { CommissionMobifoneLogType } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { CumulativePointLogType } from "../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import { CustomerLoader, ICustomer } from "../graphql/modules/customer/customer.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import { IMember, MemberLoader, MemberModel } from "../graphql/modules/member/member.model";
import {
  IRegisService,
  RegisServiceStatus,
} from "../graphql/modules/regisService/regisService.model";
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
const { RECEIVE_FROM_RESIS_SERVICE: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_RESIS_SERVICE: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_REGI_SERVICE } = CommissionMobifoneLogType;

const {
  RECEIVE_COMMISSION_1_FROM_REGI_SERVICE,
  RECEIVE_COMMISSION_2_FROM_REGI_SERVICE,
} = CommissionLogType;

export const onApprovedRegisService = new Subject<IRegisService>();


// Duyệt thành công
// Tính chiết khấu cho mobifone - commission0
// Gửi messenger cho mobifone
onApprovedRegisService.subscribe(async (regisService) => {
  const { sellerId, code, registerName, commission0 } = regisService;

  const [seller, apiKey, msg, users] = await Promise.all([
    MemberLoader.load(sellerId),
    SettingHelper.load(SettingKey.CHATBOT_API_KEY),
    SettingHelper.load(SettingKey.REGIS_SERVICE_COMPLETED_MSG_MOBIFONE),
    UserModel.find({ psid: { $exists: true } }),
  ]);

  if (commission0) {
    if (commission0 > 0) {
      await payMobifoneCommission({
        type: RECEIVE_COMMISSION_0_FROM_REGI_SERVICE,
        commission: commission0,
        id: regisService._id
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

// Duyệt thành công 
// Điểm thưởng cho khách hàng
// Gửi messenger cho customer
onApprovedRegisService.subscribe(async (regisService) => {
  const { registerId, sellerId, basePrice, code, buyerBonusPoint } = regisService;
  const [seller, customer] = await Promise.all([
    MemberLoader.load(sellerId),
    CustomerLoader.load(registerId),
  ]);

  let cumulativePointCustomer: ICustomer = null
  // Điểm thưởng cho khách hàng
  if (buyerBonusPoint) {
    if (buyerBonusPoint > 0) {
      [, cumulativePointCustomer] = await payCustomerPoint({
        customerId: registerId,
        id: regisService._id,
        type: CUSTOMER_TYPE,
        buyerBonusPoint,
      });
    }
  }


  const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
  if (pageAccount) {
    SettingHelper.load(SettingKey.REGIS_SERVICE_COMPLETED_MSG_CUSTOMER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: [pageAccount.psid],
        message: msg,
        context: {
          value: basePrice,
          code,
          point: buyerBonusPoint,
          myPoint: cumulativePointCustomer ? cumulativePointCustomer.cumulativePoint : null
        },
      });
    });
  }
});

// Duyệt thành công
// Tính chiết khấu
// Tính điểm thưởng cho người bán
// Gửi messenger cho người bán
onApprovedRegisService.subscribe(async (regisService) => {
  const { _id, sellerId, commission1, code, registerName, registerId, sellerBonusPoint }: IRegisService = regisService;

  const seller = await MemberModel.findById(sellerId);
  if (!seller)
    return;

  let commissionUpdating: IMember = null;
  if (commission1) {
    if (commission1 > 0) {
      [, commissionUpdating] = await payCommission({
        memberId: seller._id,
        type: RECEIVE_COMMISSION_1_FROM_REGI_SERVICE,
        currentCommission: seller.commission,
        commission: commission1,
        id: _id,
      });
    }
  }

  let cummulativeUpdating: IMember = null;
  if (sellerBonusPoint) {
    if (sellerBonusPoint > 0) {
      [, cummulativeUpdating] = await paySellerPoint({
        sellerId,
        id: regisService._id,
        type: SELLER_TYPE,
        sellerBonusPoint
      });
    }
  }

  if (seller.psids) {
    SettingHelper.load(SettingKey.REGIS_SERVICE_COMPLETED_MSG_SELLER).then((msg) => {
      onSendChatBotText.next({
        apiKey: seller.chatbotKey,
        psids: seller.psids,
        message: msg,
        context: {
          code,
          registerName,
          commission: commission1,
          myCommission: commissionUpdating ? commissionUpdating.commission : null,
          point: sellerBonusPoint,
          myPoint: cummulativeUpdating ? cummulativeUpdating.cumulativePoint : null,
        },
      });
    });
  }
});

// Duyệt thành công
// Tính chiết khấu cho người giới thiệu
// Gửi messenger cho người giới thiệu
onApprovedRegisService.subscribe(async (regisService) => {
  const { _id, sellerId, commission2, code }: any = regisService;
  if (commission2 > 0) {
    const seller = await MemberModel.findById(sellerId);
    if (!seller) throw ErrorHelper.mgRecoredNotFound("chủ shop");

    // kiem tra co parentIds ko ? neu co lay index = 0
    const presenterId = seller.parentIds ? seller.parentIds[0] : null;
    if (presenterId) {
      const presenter = await MemberModel.findById(presenterId);

      if (!presenter)
        return;

      await payCommission({
        memberId: presenter._id,
        type: RECEIVE_COMMISSION_2_FROM_REGI_SERVICE,
        currentCommission: presenter.commission,
        commission: commission2,
        id: _id,
      }).then((res) => {
        const commissionUpdating = res[1];
        if (presenter.psids) {
          SettingHelper.load(SettingKey.REGIS_SERVICE_COMMISSION_MSG_FOR_PRESENTER).then((msg) => {
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