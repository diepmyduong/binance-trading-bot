import { gql } from "apollo-server-express";
import { GiftType } from "./luckyWheelGift.model";

const schema = gql`
  extend type Query {
    getAllLuckyWheelGift(q: QueryGetListInput): LuckyWheelGiftPageData
    getOneLuckyWheelGift(id: ID!): LuckyWheelGift
    # Add Query
  }

  input CreateGiftInput {
    code: String
    name: String!
    desc: String
    image: String
    payPresent: String
    payPoint: Float
    eVoucherId: ID
    qty: Int
    type: String
    status:String
  }
  
  input UpdateGiftInput {
    id: ID
    code: String
    name: String!
    desc: String
    image: String
    payPresent: String
    payPoint: Float
    eVoucherId: ID
    qty: Int
    type: String
  }


  type LuckyWheelGift {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    
    "Mã quà"
    code: String 
    "Tên quà"
    name: String!
    "diển giải"
    desc: String
    "hình ảnh quà"
    image: String
    "vị trí"
    position: Int
    "phần thưởng"
    payPresent: String
    "điểm trả thưởng"
    payPoint: Float
    "số lượng"
    qty: Int
    "đã sử dụng"
    usedQty: Int
    "mã vòng quay"
    luckyWheelId: String
    "Loại quà ${Object.values(GiftType)}"
    type: String
    "Mã eVoucher"
    eVoucherId:ID
    "Vòng quay"
    luckyWheel:LuckyWheel
    "eVoucher"
    eVoucher:EVoucher
  }

  type LuckyWheelGiftPageData {
    data: [LuckyWheelGift]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
