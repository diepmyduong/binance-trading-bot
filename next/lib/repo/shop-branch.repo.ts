import { BaseModel, CrudRepository } from "./crud.repo";

export interface ShopBranch extends BaseModel {
  id: string;
  code: string;
  name: string;
  phone?: string;
  address?: string;
  wardId?: string;
  districtId?: string;
  provinceId?: string;
  province?: string;
  district?: string;
  ward?: string;
  activated?: boolean;
  location?: string;
  coverImage: string;
  isOpen: boolean;
  shipPreparationTime?: string;
  shipDefaultDistance?: number;
  shipDefaultFee?: number;
  shipNextFee?: number;
  shipOneKmFee?: number;
  shipUseOneKmFee?: boolean;
  shipNote?: string;
  operatingTimes?: OperatingTime[];
}
interface OperatingTime {
  day: number;
  timeFrames: string[];
  status: string;
}
export class ShopBranchRepository extends CrudRepository<ShopBranch> {
  apiName: string = "ShopBranch";
  displayName: string = "chi nhánh";
  shortFragment: string = this.parseFragment(`
  id: String
  code: String
  name: String
  address: String
  activated: Boolean
  coverImage: String
  isOpen: Boolean
  shipPreparationTime: String
  shipDefaultDistance: Int
  shipDefaultFee: Float
  shipNextFee: Float
  shipOneKmFee: Float
  shipUseOneKmFee: Boolean
  shipNote: String
  operatingTimes{
    day:Int
    timeFrames:[String]
    status:String
  }:[OperatingTime]
 `);
  fullFragment: string = this.parseFragment(`
  id: String
  createdAt: DateTime
  updatedAt: DateTime
  memberId: ID
  code: String
  name: String
  phone: String
  email: String
  address: String
  wardId: String
  districtId: String
  provinceId: String
  province: String
  district: String
  ward: String
  activated: Boolean
  location: Mixed
  coverImage: String
  isOpen: Boolean
  shipPreparationTime: String
  shipDefaultDistance: Int
  shipDefaultFee: Float
  shipNextFee: Float
  shipOneKmFee: Float
  shipUseOneKmFee: Boolean
  shipNote: String
  operatingTimes{
    day: Int
    status: String}: [OperatingTime]`);
}

export const ShopBranchService = new ShopBranchRepository();
