import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { Member } from "./member.repo";
import { Order } from "./order.repo";

export interface OrderLog extends BaseModel {
  orderId: string;
  type: string;
  memberId: string;
  toMemberId: string;
  customerId: string;
  note: string;
  statusText: string;
  order: Order;
  member: Member;
  toMember: Member;
  customer: Customer;
}
export class OrderLogRepository extends CrudRepository<OrderLog> {
  apiName: string = "OrderLog";
  displayName: string = "lịch sử đơn hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    orderId: ID
    type: String
    memberId: ID
    toMemberId: ID
    customerId: ID
    note: String
    statusText: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    orderId: ID
    type: String
    memberId: ID
    toMemberId: ID
    customerId: ID
    note: String
    statusText: String
    order {
      id code
    }: Order
    member {
      id name
    }: Member
    toMember {
      id name
    }: Member
    customer {
      id name
    }: Customer
  `);
}

export const OrderLogService = new OrderLogRepository();
