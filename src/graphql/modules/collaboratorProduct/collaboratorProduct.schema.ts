import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaboratorProduct(q: QueryGetListInput): CollaboratorProductPageData
    getOneCollaboratorProduct(id: ID!): CollaboratorProduct
    # Add Query
  }

  extend type Mutation {
    createCollaboratorProduct(data: CreateCollaboratorProductInput!): CollaboratorProduct
    deleteOneCollaboratorProduct(id: ID!): CollaboratorProduct
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
  }

  type CollaboratorProductPageData {
    data: [CollaboratorProduct]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
