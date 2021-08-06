import { BaseModel, CrudRepository } from "./crud.repo";
import { ShopVoucher, ShopVoucherService } from "./shop-voucher.repo";

export interface CustomerGroup extends BaseModel {
  memberId: string;
  name: string;
  filter: any;
  summary: number;
}
export class CustomerGroupRepository extends CrudRepository<CustomerGroup> {
  apiName: string = "CustomerGroup";
  displayName: string = "nhóm khách hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    filter: Mixed
    summary: Int
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    filter: Mixed
    summary: Int
  `);
  async getCustomerGroupResource(): Promise<CustomerGroupResource[]> {
    return this.query({
      query: `
        getCustomerGroupResource {
          id name type meta
        }
      `,
    }).then((res) => res.data.g0);
  }
}
export const CustomerGroupService = new CustomerGroupRepository();

export interface CustomerGroupResource {
  id: string;
  name: string;
  type: "text" | "number" | "address" | "select" | "boolean" | "ref-multi" | "date";
  meta: Partial<{
    id: string;
    name: string;
    ref: "Product" | "ProductGroup" | "Membership" | "Voucher";
    options: { id: string; name: string }[];
  }>;
}
