import { keyBy, uniq } from "lodash";
import { Subject } from "rxjs";
import { commissionLogService } from "../graphql/modules/commissionLog/commissionLog.service";
import { commissionMobifoneLogService } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.service";
import { CommissionLogType } from "../graphql/modules/commissionLog/commissionLog.model";
import { CommissionMobifoneLogType } from "../graphql/modules/commissionMobifoneLog/commissionMobifoneLog.model";
import { MemberLoader, MemberModel } from "../graphql/modules/member/member.model";
import { CustomerPointLogType } from "../graphql/modules/customerPointLog/customerPointLog.model";
import { CumulativePointLogType } from "../graphql/modules/cumulativePointLog/cumulativePointLog.model";
import { ErrorHelper } from "../helpers/error.helper";
import {
    payCommission,
    payMobifoneCommission,
    payCustomerPoint,
    paySellerPoint,
} from "./event.helper";
import { onSendChatBotText } from "./onSendToChatbot.event";
import { SettingHelper } from "../graphql/modules/setting/setting.helper";
import { SettingKey } from "../configs/settingData";
import { IRegisSMS, RegisSMSStatus } from "../graphql/modules/regisSMS/regisSMS.model";
import { CustomerLoader } from "../graphql/modules/customer/customer.model";

//set lại type chứ ko bị đụng truncate thằng dòng dưới
const { RECEIVE_FROM_REGIS_SMS: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_REGIS_SMS: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_SMS } = CommissionMobifoneLogType;

const { RECEIVE_COMMISSION_1_FROM_SMS, RECEIVE_COMMISSION_2_FROM_SMS } = CommissionLogType;

export const onCanceledSMS = new Subject<IRegisSMS>();

// Gui mess cho nguoi do
onCanceledSMS.subscribe(async (sms) => {
    const { registerId, sellerId, basePrice, code } = sms;
    const [seller, customer] = await Promise.all([
        MemberLoader.load(sellerId),
        CustomerLoader.load(registerId),
    ]);

    const pageAccount = customer.pageAccounts.find((p) => p.pageId == seller.fanpageId);
    if (pageAccount) {
        SettingHelper.load(SettingKey.SMS_CANCELED_MSG).then((msg) => {
            onSendChatBotText.next({
                apiKey: seller.chatbotKey,
                psids: [pageAccount.psid],
                message: msg,
                context: { value: basePrice, code },
            });
        });
    }
});