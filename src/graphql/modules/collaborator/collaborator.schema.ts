import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCollaborator(q: QueryGetListInput): CollaboratorPageData
    getOneCollaborator(id: ID!): Collaborator
    getFilteredCollaborators(q: QueryGetListInput): FilteredCollaboratorPageData
    getOverviewCollaboratorReport(q: QueryGetListInput): OverviewCollaboratorsReport
    # Add Query
  }

  type OverviewCollaboratorsReport {
    commission: Float
    collaboratorCount: Int
  }

  extend type Mutation {
    createCollaborator(data: CreateCollaboratorInput!): Collaborator
    updateCollaborator(id: ID!, data: UpdateCollaboratorInput!): Collaborator
    deleteOneCollaborator(id: ID!): Collaborator
    importCollaborators(file: Upload!): String
    
    # Add Mutation
  }

  input CreateCollaboratorInput {
    code: String!
    name: String!
    phone: String!
  }

  input UpdateCollaboratorInput {
    code: String
    name: String
    phone: String
  }

  type Collaborator {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime
    
    "Mã Cộng tác viên"
    code: String
    "Tên cộng tác viên"
    name: String
    "Số điện thoại" 
    phone: String
    "Chủ shop"
    memberId: ID

    customer: Customer
    member: Member
  }


  type FilteredCollaborator {
    phone: String
    memberIds: [ID]
    customerId: ID
    customer: Customer
    members: [Member]
    total:Float
  }

  type FilteredCollaboratorPageData {
    data: [FilteredCollaborator]
    total: Int
    pagination: Pagination
  }

  type CollaboratorPageData {
    data: [Collaborator]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
