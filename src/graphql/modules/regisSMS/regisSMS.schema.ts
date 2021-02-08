import { gql } from "apollo-server-express";
import { RegisSMSStatus } from "./regisSMS.model";

const schema = gql`
  extend type Query {
    getAllRegisSMS(q: QueryGetListInput): RegisSMSPageData
    getOneRegisSMS(id: ID!): RegisSMS
  }

  extend type Mutation {
    createRegisSMS(data: CreateRegisSMSInput!): RegisSMS
    approveRegisSMS(id: ID!): RegisSMS
    cancelRegisSMS(id: ID!): RegisSMS
    importCsvForApprovingSMS(csvFile: Upload!): Mixed
    importSMSApproving(file: Upload!): String
  }

  input CreateRegisSMSInput {
    productId: String!
    registerName: String!
    registerPhone: String!
    campaignId: String
  }

  type RegisSMS {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã đăng ký"
    code: String 
    "Chủ shop"
    sellerId: ID 
    "Sản phẩm SMS"
    productId: ID 
    "Tên sản phẩm"
    productName: String 
    "Giá sản phẩm"
    basePrice: Float
    "Khách hàng"
    registerId: ID 
    "Tên khách hàng"
    registerName: String 
    "Điện thoại đăng ký"
    registerPhone: String 
    "Trạng thái ${Object.values(RegisSMSStatus)}"
    status: String
    "Hoa hồng Mobifone"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng giới thiệu"
    commission2: Float
    "Điểm thường người bán"
    sellerBonusPoint: Float
    "Điểm thưởng người mua"
    buyerBonusPoint: Float
    "Mã chiến dịch"
    campaignId: String
    "Mã kết quả chiến dịch"
    campaignSocialResultId: String

    seller: Member
    product: Product
    register: Customer
    campaign: Campaign
    campaignSocialResult: CampaignSocialResult
  }

  type RegisSMSPageData {
    data: [RegisSMS]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
