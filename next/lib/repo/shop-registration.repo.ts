import { BaseModel, CrudRepository } from "./crud.repo";

export interface ShopRegistration extends BaseModel {
  email: string;
  phone: string;
  name: string;
  shopCode: string;
  shopName: string;
  shopLogo: string;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  province: string;
  district: string;
  ward: string;
  birthday: string;
  gender: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt: string;
  rejectedAt: string;
  memberId: string;
}
export class ShopRegistrationRepository extends CrudRepository<ShopRegistration> {
  apiName: string = "ShopRegistration";
  displayName: string = "đăng ký cửa hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    email: String
    phone: String
    name: String
    shopCode: String
    shopName: String
    shopLogo: String
    address: String
    provinceId: String
    districtId: String
    wardId: String
    province: String
    district: String
    ward: String
    birthday: DateTime
    gender: String
    status: String
    approvedAt: DateTime
    rejectedAt: DateTime
    memberId: ID
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    email: String
    phone: String
    name: String
    shopCode: String
    shopName: String
    shopLogo: String
    address: String
    provinceId: String
    districtId: String
    wardId: String
    province: String
    district: String
    ward: String
    birthday: DateTime
    gender: String
    status: String
    approvedAt: DateTime
    rejectedAt: DateTime
    memberId: ID
  `);

  approveShopRegis(regisId: string, approve: boolean) {
    return this.mutate({
      mutation: `
      approveShopRegis(regisId: "${regisId}", approve: ${approve}) {
        id
      }
    `,
    });
  }
}

export const ShopRegistrationService = new ShopRegistrationRepository();

export const SHOP_REGISTRATION_STATUS: Option[] = [
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "APPROVED", label: "Đã duyệt", color: "success" },
  { value: "REJECTED", label: "Từ chối", color: "danger" },
];
