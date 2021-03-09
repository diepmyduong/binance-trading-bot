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
import { IOrder, OrderStatus, ShipMethod } from "../graphql/modules/order/order.model";
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

//set lại type chứ ko bị đụng truncate thằng dòng dưới
const { RECEIVE_FROM_ORDER: CUSTOMER_TYPE } = CustomerPointLogType;

const { RECEIVE_FROM_ORDER: SELLER_TYPE } = CumulativePointLogType;

const { RECEIVE_COMMISSION_0_FROM_ORDER } = CommissionMobifoneLogType;

const {
  RECEIVE_COMMISSION_1_FROM_ORDER,
  RECEIVE_COMMISSION_2_FROM_ORDER,
} = CommissionLogType;
export const onConfirmedOrder = new Subject<IOrder>();

// xac nhan don hang 
// thong bao den chu shop
// thong bao den khach hang
onConfirmedOrder.subscribe(async (order) => {
  const { shipMethod , addressDeliveryId } = order;
  if(shipMethod === ShipMethod.POST){
 
  }
});

