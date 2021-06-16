import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaboratorCampaign(q: QueryGetListInput): CollaboratorCampaignPageData
    getOneCollaboratorCampaign(id: ID!): CollaboratorCampaign
    # Add Query
  }

  extend type Mutation {
    createCollaboratorCampaign(data: CreateCollaboratorCampaignInput!): CollaboratorCampaign
    updateCollaboratorCampaign(
      id: ID!
      data: UpdateCollaboratorCampaignInput!
    ): CollaboratorCampaign
    deleteOneCollaboratorCampaign(id: ID!): CollaboratorCampaign
    # Add Mutation
  }

  input CreateCollaboratorCampaignInput {
    "Mã chiến dịch"
    code: String
    "Tên chi ến dịch"
    name: String!
    "Tiêu đề"
    title: String!
    "Nội dung"
    content: String!
    "Hash Tags"
    hashtags: [String]
    "Hình ảnh"
    image: String
    "Ngày bắt đầu"
    startDate: DateTime!
    "Ngày kết thúc"
    endDate: DateTime
    "Danh sách chủ shop id được áp dụng"
    memberIds: [ID]
    "Chi nhánh áp dụng"
    branchId: ID
    "Sản phẩm áp dụng chiến dịch"
    productId: ID
    "Trạng thái đăng"
    isPublish: Boolean
    "Điểm ghi nhận"
    point: Float
  }

  input UpdateCollaboratorCampaignInput {
    "Mã chiến dịch"
    code: String
    "Tên chi ến dịch"
    name: String
    "Tiêu đề"
    title: String
    "Nội dung"
    content: String
    "Hash Tags"
    hashtags: [String]
    "Hình ảnh"
    image: String
    "Ngày bắt đầu"
    startDate: DateTime
    "Ngày kết thúc"
    endDate: DateTime
    "Danh sách chủ shop id được áp dụng"
    memberIds: [ID]
    "Chi nhánh áp dụng"
    branchId: ID
    "Sản phẩm áp dụng chiến dịch"
    productId: ID
    "Trạng thái đăng"
    isPublish: Boolean
    "Điểm ghi nhận"
    point: Float
  }

  type CollaboratorCampaign {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chiến dịch"
    code: String
    "Tên chi ến dịch"
    name: String
    "Tiêu đề"
    title: String
    "Nội dung"
    content: String
    "Hash Tags"
    hashtags: [String]
    "Hình ảnh"
    image: String
    "Ngày bắt đầu"
    startDate: DateTime
    "Ngày kết thúc"
    endDate: DateTime
    "Danh sách chủ shop id được áp dụng"
    memberIds: [ID]
    "Chi nhánh áp dụng"
    branchId: ID
    "Sản phẩm áp dụng chiến dịch"
    productId: ID
    "Trạng thái đăng"
    isPublish: Boolean
    "Điểm ghi nhận"
    point: Float

    product: Product
  }

  type CollaboratorCampaignPageData {
    data: [CollaboratorCampaign]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
