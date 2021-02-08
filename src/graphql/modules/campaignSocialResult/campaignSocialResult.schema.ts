import { gql } from "apollo-server-express";
import { MessageReceivingStatus } from "./campaignSocialResult.model";

const schema = gql`
  extend type Query {
    getAllCampaignSocialResult(q: QueryGetListInput): CampaignSocialResultPageData
    getOneCampaignSocialResult(id: ID!): CampaignSocialResult
    # Add Query
  }

  extend type Mutation {
    updateMessageReceivingStatus(id: ID!, data: UpdateStatusInput!): CampaignSocialResult
    syncSocialCampaignByFacebook(campaignId: String!, accessToken:String): [CampaignSocialResult]
    # Add Mutation
  }

  input UpdateStatusInput {
    messageReceivingStatus: String
  }

  type CampaignSocialResult {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Link quảng cáo"
    affiliateLink: String
    "Mã chiến dịch"
    campaignId: ID
    "Mã nhân viên"
    memberId: ID
    "Lượt like"
    likeCount: Int
    "Lượt share"
    shareCount: Int
    "Lượt comment"
    commentCount: Int
    "Chủ shop"
    member:Member
    "Chiến dịch"
    campaign:Campaign
    "tình trạng nhận tin nhắn ${Object.values(MessageReceivingStatus)}"
    messageReceivingStatus: String
    "Đồng bộ"
    synced: Boolean
    "Danh sách mã sản phẩm trong đơn hàng"
    orderItemIds: [ID]
    "Danh sách sản phẩm trong đơn hàng"
    orderItems: [OrderItem]
    "Danh sách mã đăng ký SMS"
    regisSMSIds: [ID]
    "Danh sách đăng ký SMS"
    regisSMSs: [RegisSMS]
    "Danh sách mã đăng ký dịch vụ"
    regisServiceIds: [ID]
    "Danh sách đăng ký dịch vụ"
    regisServices: [RegisService]
    orderStats: CampaignOrderStats
    smsStats: CampaignRegisSMSStats
    serviceStats: CampaignRegisServiceStats
  }

  type CampaignSocialResultPageData {
    data: [CampaignSocialResult]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
