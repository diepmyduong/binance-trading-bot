import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllBanner(q: QueryGetListInput): BannerPageData
    getOneBanner(id: ID!): Banner
    # Add Query
  }

  extend type Mutation {
    createBanner(data: CreateBannerInput!): Banner
    updateBanner(id: ID!, data: UpdateBannerInput!): Banner
    deleteOneBanner(id: ID!): Banner
    # Add Mutation
  }

  input CreateBannerInput {
    "Tên banner"
    name: String!
    "Hình ảnh"
    image: String!
    "Mã sản phẩm"
    productId: ID!
    "Kích hoạt"
    isPublish: Boolean
    "Ưu tiên"
    priority: Int
  }

  input UpdateBannerInput {
    "Tên banner"
    name: String
    "Hình ảnh"
    image: String
    "Mã sản phẩm"
    productId: ID
    "Kích hoạt"
    isPublish: Boolean
    "Ưu tiên"
    priority: Int
  }

  type Banner {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Tên banner"
    name: String
    "Hình ảnh"
    image: String
    "Mã sản phẩm"
    productId: ID
    "Kích hoạt"
    isPublish: Boolean
    "Ưu tiên"
    priority: Int

    product: Product
  }

  type BannerPageData {
    data: [Banner]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
