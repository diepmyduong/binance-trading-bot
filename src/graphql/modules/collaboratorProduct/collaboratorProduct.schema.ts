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

    shortUrl: String
    collaboratorId: ID
    productId: ID
    collaborator: Collaborator
    product: Product
  }

  type CollaboratorProductPageData {
    data: [CollaboratorProduct]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
