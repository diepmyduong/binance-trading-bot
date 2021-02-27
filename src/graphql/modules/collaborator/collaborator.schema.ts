import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaborator(q: QueryGetListInput): CollaboratorPageData
    getOneCollaborator(id: ID!): Collaborator
    # Add Query
  }

  extend type Mutation {
    createCollaborator(data: CreateCollaboratorInput!): Collaborator
    updateCollaborator(id: ID!, data: UpdateCollaboratorInput!): Collaborator
    deleteOneCollaborator(id: ID!): Collaborator
    importCollaborators(file: Upload!): String
    # Add Mutation
  }

  input CreateCollaboratorInput {
    name: String!
    phone: String!
  }

  input UpdateCollaboratorInput {
    name: String
    phone: String
  }

  type Collaborator {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    
    "Tên khách hàng"
    name: String
    "Số điện thoại" 
    phone: String
    "Chủ shop"
    memberId: ID

    customer: Customer
    member: Member
  }

  type CollaboratorPageData {
    data: [Collaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
