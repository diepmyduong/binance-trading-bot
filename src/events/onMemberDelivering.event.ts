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
import {
  IOrder,
  OrderModel,
  OrderStatus,
  PaymentMethod,
} from "../graphql/modules/order/order.model";
import { OrderLogModel, OrderLogType } from "../graphql/modules/orderLog/orderLog.model";

export const onMemberDelivering = new Subject<IOrder>();

onMemberDelivering.subscribe(async (order: IOrder) => {
  const {
    buyerId,
    sellerId,
    id,
    status,
    toMemberId
  } = order;
  
  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.MEMBER_DELIVERING,
    memberId: sellerId,
    customerId: buyerId,
    orderStatus: status,
  });

  if(toMemberId){
    log.toMemberId = toMemberId;
    log.type = OrderLogType.MEMBER_DELIVERING;
  }

  await log.save();
});