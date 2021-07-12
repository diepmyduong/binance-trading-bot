import { gql } from "apollo-server-express";
import { ShopCommentStatus } from "./shopComment.model";

const schema = gql`
  extend type Query {
    getAllShopComment(q: QueryGetListInput): ShopCommentPageData
    getOneShopComment(id: ID!): ShopComment
    # Add Query
  }

  extend type Mutation {
    createShopComment(data: CreateShopCommentInput!): ShopComment
    updateShopComment(id: ID!, data: UpdateShopCommentInput!): ShopComment
    deleteOneShopComment(id: ID!): ShopComment
    # Add Mutation
  }

  input CreateShopCommentInput {
    "Tên người comment"
    ownerName: String!
    "Nội dung bình luận"
    message: String!
    "Điểm đánh giá"
    rating: Int
    "Trạng thái bình luận ${Object.values(ShopCommentStatus)}"
    status: String
    "Tag"
    tags: [ShopTagInput]
  }

  input UpdateShopCommentInput {
    "Tên người comment"
    ownerName: String
    "Nội dung bình luận"
    message: String
    "Điểm đánh giá"
    rating: Int
    "Trạng thái bình luận ${Object.values(ShopCommentStatus)}"
    status: String
    "Tag"
    tags: [ShopTagInput]
  }

  type ShopComment {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Mã đơn hàng"
    orderId: ID
    "Tên người comment"
    ownerName: String
    "Nội dung bình luận"
    message: String
    "Điểm đánh giá"
    rating: Int
    "Trạng thái bình luận ${Object.values(ShopCommentStatus)}"
    status: String
    "Tag"
    tags: [ShopTag]
  }

  type ShopCommentPageData {
    data: [ShopComment]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
