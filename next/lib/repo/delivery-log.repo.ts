import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { Member } from "./member.repo";
import { Order } from "./order.repo";

export interface DeliveryLog extends BaseModel {
  orderId: string;
  memberId: string;
  customerId: string;
  deliveryId: string;
  deliveryCode: string;
  orderNumber: string;
  shipMethod: string;
  status: string;
  statusName: string;
  statusDetail: string;
  statusDate: string;
  note: string;
  moneyCollection: number;
  moneyFeeCOD: number;
  moneyTotal: number;
  expectedDelivery: string;
  productWeight: number;
  orderService: string;
  locationCurrently: string;
  detail: string;
}
export class DeliveryLogRepository extends CrudRepository<DeliveryLog> {
  apiName: string = "DeliveryLog";
  displayName: string = "lịch sử giao hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    orderId: ID
    memberId: ID
    customerId: ID
    deliveryId: String
    deliveryCode: String
    orderNumber: String
    shipMethod: String
    status: String
    statusName: String
    statusDetail: String
    statusDate: DateTime
    note: String
    moneyCollection: Float
    moneyFeeCOD: Float
    moneyTotal: Float
    expectedDelivery: String
    productWeight: Float
    orderService: String
    locationCurrently: String
    detail: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    orderId: ID
    memberId: ID
    customerId: ID
    deliveryId: String
    deliveryCode: String
    orderNumber: String
    shipMethod: String
    status: String
    statusName: String
    statusDetail: String
    statusDate: DateTime
    note: String
    moneyCollection: Float
    moneyFeeCOD: Float
    moneyTotal: Float
    expectedDelivery: String
    productWeight: Float
    orderService: String
    locationCurrently: String
    detail: String
  `);
}

export const DeliveryLogService = new DeliveryLogRepository();
