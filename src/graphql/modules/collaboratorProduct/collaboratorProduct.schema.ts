import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaboratorProduct(q: QueryGetListInput): CollaboratorProductPageData
    getOneCollaboratorProduct(id: ID!): CollaboratorProduct
    # Add Query
  }

  extend type Mutation {
    createCollaboratorProduct(
      data: CreateCollaboratorProductInput!
    ): CollaboratorProduct
    deleteOneCollaboratorProduct(id: ID!): CollaboratorProduct
    trackProductUrlEngagement(campaignId: String!, accessToken:String): [CollaboratorProduct]
    # Add Mutation
  }

  input CreateCollaboratorProductInput {
    collaboratorId: ID!
    productId: ID!
  }

  type CollaboratorProduct {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    "Mã cộng tác viên"
    collaboratorId: ID
    "Mã sản phẩm"
    productId: ID
    collaborator: Collaborator
    product: Product

    "Mã giới thiệu"
    shortCode: String
    "Link giới thiệu"
    shortUrl: String
    "Số lượng click"
    clickCount: Int
    "Số lượng like"
    likeCount: Int
    "Số lượng share"
    shareCount: Int
    "Số lượng comment"
    commentCount: Int
  }

  type CollaboratorProductPageData {
    data: [CollaboratorProduct]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
