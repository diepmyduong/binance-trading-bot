import { gql } from "apollo-server-express";
import { MemberType } from "../member/member.model";
import { CampaignStatus } from "./campaign.model";

const schema = gql`
  extend type Query {
    getAllCampaign(q: QueryGetListInput): CampaignPageData
    getOneCampaign(id: ID!): Campaign
    # Add Query
  }

  extend type Mutation {
    createCampaign(data: CreateCampaignInput!): Campaign
    updateCampaign(id: ID!, data: UpdateCampaignInput!): Campaign
    deleteOneCampaign(id: ID!): Campaign
    sendCampaignMessage(id: ID!): Campaign
    # Add Mutation
  }

  input CreateCampaignInput {
    code: String
    name: String
    title: String
    content: String
    hashtags: [String]
    image: String

    startDate: DateTime
    endDate: DateTime

    memberType:String
    provinceId: String
    branchId: String
    productId: String
  }

  input UpdateCampaignInput {
    code: String
    name: String
    title: String
    content: String
    hashtags: [String]
    image: String

    startDate: DateTime
    endDate: DateTime
  }

  type Campaign {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    
    "Mã"
    code: String
    "tên"
    name: String!
    "tiêu đề"
    title: String
    "nội dung"
    content: String
    "hình ảnh"
    image: String
    "Hashtags"
    hashtags: [String]
    "ngày bắt đầu"
    startDate: DateTime
    "ngày kết thúc"
    endDate: DateTime
    "loại thành viên ${Object.values(MemberType)}"
    memberType: String
    "Mã tỉnh thành"
    provinceId: String
    "Tỉnh thành"
    province: String
    "Thanh vien"
    memberId: ID
    "Mã chi nhánh"
    branchId: ID
    "Danh sách mã điểm bán được áp dụng"
    memberIds: [ID]
    "Danh sách mã kết quả chiến dịch"
    campaignSocialResultIds:[ID]
    "Mã sản phẩm"
    productId: ID
    "Sản phẩm"
    product:Product
    "Trạng thái: ${Object.values(CampaignStatus)}"
    status: String

    members:[Member]
    campaignSocialResults:[CampaignSocialResult]
  }

  type CampaignPageData {
    data: [Campaign]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
