import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";
import { ProductService } from "./product.repo";

export interface Customer extends BaseModel {
  memberId: string;
  code: string;
  name: string;
  facebookName: string;
  uid: string;
  phone: string;
  avatar: string;
  gender: string;
  birthday: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  cumulativePoint: number;
  commission: number;
  pageAccounts: [CustomerPageAccount];
  latitude: number;
  longitude: number;
}
interface CustomerPageAccount {
  psid: string;
  pageId: string;
  memberId: string;
  member: Member;
}
export class CustomerRepository extends CrudRepository<Customer> {
  apiName: string = "Customer";
  displayName: string = "khách hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    code: String
    name: String
    facebookName: String
    uid: String
    phone: String
    avatar: String
    gender: String
    birthday: DateTime
    address: String
    province: String
    district: String
    ward: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    code: String
    name: String
    facebookName: String
    uid: String
    phone: String
    avatar: String
    gender: String
    birthday: DateTime
    address: String
    province: String
    district: String
    ward: String
    provinceId: String
    districtId: String
    wardId: String
    cumulativePoint: Float
    commission: Float
    pageAccounts {
      psid: string;
      pageId: string;
      memberId: string;
      member {
        id: String
        name: String
      }: Member;
    }: [CustomerPageAccount]
    latitude: Float
    longitude: Float
  `);
}

export const CustomerService = new CustomerRepository();