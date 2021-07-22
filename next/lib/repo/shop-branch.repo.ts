import { BaseModel, CrudRepository } from "./crud.repo";

export interface ShopBranch extends BaseModel {
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
  location?: any;
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
  distance: number;
}
export interface OperatingTime {
  day: number;
  timeFrames: string[][];
  status: "OPEN" | "CLOSED" | "TIME_FRAME";
}
export class ShopBranchRepository extends CrudRepository<ShopBranch> {
  apiName: string = "ShopBranch";
  displayName: string = "chi nhánh";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    name: String
    address: String
    wardId: String
    districtId: String
    provinceId: String
    province: String
    district: String
    ward: String
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
    operatingTimes {
      day: Int
      timeFrames: Mixed
      status: String
    }: [OperatingTime]
  `);
  async getAllBranchDistance(lat: number, lng: number) {
    return await this.apollo
      .query({
        query: this
          .gql`query {  getAllShopBranch { data{ ${this.fullFragment} distance(lat:${lat}, lng:${lng}) } }}`,
      })
      .then((res) => res.data["getAllShopBranch"] as ShopBranch);
  }
}

export const ShopBranchService = new ShopBranchRepository();

export const OPERATING_TIME_STATUS: Option[] = [
  { value: "OPEN", label: "Mở 24h" },
  { value: "CLOSED", label: "Đóng cửa" },
  { value: "TIME_FRAME", label: "Mở theo giờ" },
];
