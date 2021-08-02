import { BaseModel, CrudRepository } from "./crud.repo";

export interface InvitedCustomer extends BaseModel {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  ordered: boolean;
  commission: number;
}
export class InvitedCustomerRepository extends CrudRepository<InvitedCustomer> {
  apiName: string = "InvitedCustomer";
  displayName: string = "khách hàng được mời";
  shortFragment: string = this.parseFragment(`
    id: string
    name: string
    avatar: string
    phone: string
    ordered: boolean
    commission: number
  `);
  fullFragment: string = this.parseFragment(`
    id: string
    name: string
    avatar: string
    phone: string
    ordered: boolean
    commission: number
  `);
}

export const InvitedCustomerService = new InvitedCustomerRepository();
