import { gql } from "apollo-server-express";
import { AgencyType, WheelStatus } from "./luckyWheel.model";

const schema = gql`
  extend type Query {
    getAllLuckyWheel(q: QueryGetListInput): LuckyWheelPageData
    getOneLuckyWheel(id: ID!): LuckyWheel
    # Add Query
  }

  extend type Mutation {
    createLuckyWheel(data: CreateLuckyWheelInput!): LuckyWheel
    updateLuckyWheel(id: ID!, data: UpdateLuckyWheelInput!): LuckyWheel
    deleteOneLuckyWheel(id: ID!): LuckyWheel
    # deleteOneLuckyWheel(id: ID!): LuckyWheel
    # Add Mutation
  }

  input CreateLuckyWheelInput {
    code: String
    title: String
    backgroundColor: String
    backgroundImage: String
    buttonColor: String
    bannerImage: String
    footerImage: String
    wheelImage: String
    pinImage: String
    btnTitle: String
    startDate: DateTime
    endDate: DateTime
    successRatio: Float
    gamePointRequired: Int
    gifts: [CreateGiftInput]
    status:String
    designConfig: Mixed
    limitTimes: Int
  }
  
  input UpdateLuckyWheelInput {
    code: String
    title: String
    backgroundColor: String
    backgroundImage: String
    buttonColor: String
    bannerImage: String
    footerImage: String
    wheelImage: String
    pinImage: String
    btnTitle: String
    startDate: DateTime
    endDate: DateTime
    successRatio: Float
    gamePointRequired: Int   
    gifts: [UpdateGiftInput]
    status:String
    designConfig: Mixed
    limitTimes: Int
  }

  type LuckyWheel {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    "Mã vòng quay"
    code: String 
    "Tiêu đề vòng quay"
    title: String
    "màu nền vòng quay"
    backgroundColor: String 
    "hình nền vòng quay"
    backgroundImage: String
    "màu nút"
    buttonColor: String 
    "ảnh banner"
    bannerImage: String 
    "ảnh footer"
    footerImage: String 
    "ảnh vòng quay"
    wheelImage: String 
    "ảnh pin"
    pinImage: String 
    "tên nút"
    btnTitle: String 
    "ngày bắt đầu"
    startDate: DateTime 
    "ngày kết thúc"
    endDate: DateTime 
    "tỉ lệ thắng"
    successRatio: Float
    "Điểm chơi game được yêu cầu"
    gamePointRequired: Float
    "Danh sách mã món quà" 
    giftIds: [ID]
    "Mã chủ shop"
    memberId: ID
    "Danh sách món quà" 
    gifts: [LuckyWheelGift]
    "Danh sách kết quả quay" 
    results:[LuckyWheelResult]
    "Loại đại lý ${Object.values(AgencyType)}"
    agencyType: String
    "Trạng thái vòng xoay  ${Object.values(WheelStatus)}"
    status: String
    "Cấu hình thiết kế vòng quay"
    designConfig: Mixed
    "Giới hạn số lần quay"
    limitTimes: Int
  }

  type LuckyWheelPageData {
    data: [LuckyWheel]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
