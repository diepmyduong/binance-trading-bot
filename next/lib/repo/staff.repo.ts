import { BaseModel, CrudRepository } from "./crud.repo";
import { ShopBranch } from "./shop-branch.repo";

export interface Staff extends BaseModel {
  memberId: string;
  username: string;
  name: string;
  phone: string;
  avatar: string;
  address: string;
  branchId: string;
  branch: ShopBranch;
  scopes: string[];
}
export class StaffRepository extends CrudRepository<Staff> {
  apiName: string = "Staff";
  displayName: string = "nhân viên";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    username: String
    name: String
    phone: String
    avatar: String
    address: String
    branchId: ID
    branch {
      id: String
      name: String
    }: ShopBranch
    scopes: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    username: String
    name: String
    phone: String
    avatar: String
    address: String
    branchId: ID
    branch {
      id: String
      name: String
    }: ShopBranch
    scopes: String
  `);
}

export const StaffService = new StaffRepository();

export const STAFF_SCOPES: Option[] = [
  { value: "REPORT", label: "Xem báo cáo" },
  { value: "MANAGER", label: "Quản lý" },
];
