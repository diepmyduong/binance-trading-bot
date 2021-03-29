import { Subject } from "rxjs";
import {
  IOrder,
  OrderStatus,
} from "../graphql/modules/order/order.model";
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
