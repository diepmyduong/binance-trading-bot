import { Subject } from "rxjs";
import { IOrder } from "../graphql/modules/order/order.model";

export const OnCreateOrder = new Subject<IOrder>();

// Gửi thông báo tới nhân viên chi nhánh
OnCreateOrder.subscribe(async (order) => {});
