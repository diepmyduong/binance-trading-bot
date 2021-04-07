import { Subject } from "rxjs";
import {
  IOrder,
} from "../graphql/modules/order/order.model";
import { orderService } from "../graphql/modules/order/order.service";
import { OrderLogModel } from "../graphql/modules/orderLog/orderLog.model";
import { OrderLogType } from "../graphql/modules/orderLog/orderLog.model";

export const onTransfering = new Subject<IOrder>();

// gui tin nhan cho nguoi duoc chuyen
onTransfering.subscribe(async (order) => {
  const { buyerId, fromMemberId, itemIds, deliveryInfo } = order;

});



// luu log lai
onTransfering.subscribe(async (order) => {
  const {
    buyerId,
    sellerId,
    id,
    status,
    toMemberId,
  } = order;
  
  const log = new OrderLogModel({
    orderId: id,
    type: OrderLogType.TRANSFERED,
    memberId: sellerId,
    toMemberId: toMemberId,
    customerId: buyerId,
    orderStatus: status,
  });

  await log.save().then(log => { orderService.updateLogToOrder({order, log}) });
});
