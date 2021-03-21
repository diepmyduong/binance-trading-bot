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
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";

export const onApprovedFailureOrder = new Subject<IOrder>();

onApprovedFailureOrder.subscribe(async (order: IOrder) => {
  const { buyerId, sellerId, id, status, toMemberId } = order;

  if (status === OrderStatus.FAILURE) {
    const log = new OrderLogModel({
      orderId: id,
      type: OrderLogType.MEMBER_FAILURE,
      memberId: sellerId,
      customerId: buyerId,
      orderStatus: status,
    });

    if (toMemberId) {
      log.toMemberId = toMemberId;
      log.type = OrderLogType.TO_MEMBER_FAILURE;
    }

    await log.save();
  }
});
