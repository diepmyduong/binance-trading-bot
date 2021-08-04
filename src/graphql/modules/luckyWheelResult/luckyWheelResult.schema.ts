import { gql } from "apollo-server-express";
import { GiftType } from "../luckyWheelGift/luckyWheelGift.model";
import { SpinStatus } from "./luckyWheelResult.model";

const schema = gql`
  extend type Query {
    getAllLuckyWheelResult(q: QueryGetListInput): LuckyWheelResultPageData
    getOneLuckyWheelResult(id: ID!): LuckyWheelResult
    # Add Query
  }

  extend type Mutation {
    playLuckyWheel(luckyWheelId: ID!): LuckyWheelResult
    # Add Mutation
  }

  type LuckyWheelResult {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    "Mã quà của vòng quay"
    giftId: String
    "Tên quà của vòng quay"
    giftName: String
    "số lượng điểm chơi game đã sử dụng"
    gamePointUsed: Int
    "Mã khách hàng"
    customerId: String
    "mã vòng quay"
    luckyWheelId: String 
    "điểm trả thưởng"
    payPoint: Float
    "mã nhân viên"
    memberId: String
    "Loại quà ${Object.values(GiftType)}"
    giftType:String
    "Tình trạng ${Object.values(SpinStatus)}"
    status:String
    "Quà vòng quay"
    luckyWheelGift: LuckyWheelGift,
    "Chủ shop"
    member:  Member,
    "Khách hàng"
    customer: Customer,
    "Vòng quay"
    luckyWheel:  LuckyWheel,
    "mã thưởng evoucher"
    eVoucherCode: String
  }

  type LuckyWheelResultPageData {
    data: [LuckyWheelResult]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
