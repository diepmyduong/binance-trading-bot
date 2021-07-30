import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";
import { Customer } from "./customer.repo";
import { Order } from "./order.repo";

export interface CommissionLog extends BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  value: number;
  type: string;
  orderId: string;
  regisSMSId: string;
  regisServiceId: string;
  note: string;
  order: Order;
  // regisSMS: RegisSMS;
  // regisService: RegisService;
  member: Member;
}
export class CommissionLogRepository extends CrudRepository<CommissionLog> {
  apiName: string = "CommissionLog";
  displayName: string = "CommissionLog";
  shortFragment: string = this.parseFragment(`
    createdAt: DateTime
    value: Float
    type: String
    orderId: ID
    note: String
    order{code}
  `);
  fullFragment: string = this.parseFragment(`
  id: String
  createdAt: DateTime
  updatedAt: DateTime
  memberId: ID
  value: Float
  type: String
  orderId: ID
  regisSMSId: ID
  regisServiceId: ID
  note: String
  order{code}
  regisSMS: RegisSMS
  regisService: RegisService
  member{phone name}
  }`);
}
export const CommissionLogService = new CommissionLogRepository();
