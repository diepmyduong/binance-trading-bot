import { BaseModel, CrudRepository } from "./crud.repo";
import { Member } from "./member.repo";
import { ProductService } from "./product.repo";
import { Collaborator } from "./collaborator.repo";

export interface Customer extends BaseModel {
  memberId: string;
  code: string;
  name: string;
  facebookName: string;
  fullAddress: string;
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
  addressNote: string;
  isCollaborator: Boolean;
  collaborator: Collaborator;
  orderStats: {
    revenue: number;
    voucher: number;
    discount: number;
    total: number;
    completed: number;
    canceled: number;
  };
}
interface CustomerPageAccount {
  psid: string;
  pageId: string;
  memberId: string;
  member: Member;
}
export interface CustomeUpdateMeInput {
  name: string;
  address?: string;
  phone: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  avatar?: string;
  gender?: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  addressNote: string;
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
    fullAddress: String
    isCollaborator: Boolean
    addressNote: String;
    orderStats {
      revenue: Float
      voucher: Int
      discount: Float
      total: Int
      completed: Int
      canceled: Int
    }: CustomerOrderStats
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
    fullAddress: String
    addressNote: String;
    isCollaborator: Boolean
    collaborator{
      shortCode: String
      shortUrl: String
    }
    pageAccounts {
      psid: fullAddress: String
      pageId: fullAddress: String
      memberId: fullAddress: String
      member {
        id: String
        name: String
      }: Member;
    }: [CustomerPageAccount]
    latitude: Float
    longitude: Float
    orderStats {
      revenue: Float
      voucher: Int
      discount: Float
      total: Int
      completed: Int
      canceled: Int
    }: CustomerOrderStats
  `);
  async loginCustomerByPhone(phone, otp?): Promise<{ customer: Customer; token: string }> {
    return await this.apollo
      .mutate({
        mutation: this.gql`mutation {  loginCustomerByPhone(phone: "${phone}", ${
          otp ? `otp:"${otp}"` : ""
        }) {
          token
          customer{
            ${CustomerService.fullFragment}
          }
        }}`,
      })
      .then((res) => ({
        customer: res.data["loginCustomerByPhone"]["customer"] as Customer,
        token: res.data["loginCustomerByPhone"]["token"] as string,
      }));
  }
  async getCustomer() {
    return await this.query({
      query: `customerGetMe { ${this.fullFragment} }`,
      options: {
        fetchPolicy: "no-cache",
      },
    }).then((res) => res.data["g0"] as Customer);
  }
  async requestOtp(phone: string) {
    return await this.mutate({
      mutation: `requestOtp(phone:"${phone}")`,
    }).then((res) => res.data["g0"]);
  }
  async updatePresenter(colCode) {
    return await this.mutate({
      mutation: `updatePresenter(colCode: "${colCode}")`,
    }).then((res) => res.data["g0"]);
  }
}

export const CustomerService = new CustomerRepository();
