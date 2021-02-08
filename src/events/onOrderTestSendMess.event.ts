import { keyBy, uniq } from "lodash";
import { Subject } from "rxjs";
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
import { IOrder, OrderStatus } from "../graphql/modules/order/order.model";
import { CustomerLoader } from "../graphql/modules/customer/customer.model";

//set lại type chứ ko bị đụng truncate thằng dòng dưới
const { RECEIVE_FROM_ORDER: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_ORDER: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_ORDER } = CommissionMobifoneLogType;

const {
    RECEIVE_COMMISSION_1_FROM_ORDER,
    RECEIVE_COMMISSION_2_FROM_ORDER,
} = CommissionLogType;
export const onOrderTestSendMess = new Subject<IOrder>();

// Gui mess cho nguoi do
onOrderTestSendMess.subscribe(async () => {
    SettingHelper.load(SettingKey.ORDER_COMPLETED_MSG).then((msg) => {
        onSendChatBotText.next({
            apiKey: "AK|5f57dbda8a92c400161af253|eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7fSwicm9sZSI6ImFwaV9rZXkiLCJleHAiOiIyMTIwLTA5LTA4VDE5OjMwOjMzLjc0NloifQ.bECICaolQ-r1-0iLU_0fKtG247plHQuy0OQkwRA0jg8",
            psids: ["3765204193532396"],
            message: msg,
            context: {},
        });
    });
});
