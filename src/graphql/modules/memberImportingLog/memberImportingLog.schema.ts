import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllMemberImportingLog(q: QueryGetListInput): MemberImportingLogPageData
    getOneMemberImportingLog(id: ID!): MemberImportingLog
    # Add Query
  }

  extend type Mutation {
    createMemberImportingLog(data: CreateMemberImportingLogInput!): MemberImportingLog
    updateMemberImportingLog(id: ID!, data: UpdateMemberImportingLogInput!): MemberImportingLog
    deleteOneMemberImportingLog(id: ID!): MemberImportingLog
    # Add Mutation
  }

  input CreateMemberImportingLogInput {
    name: String
  }

  input UpdateMemberImportingLogInput {
    name: String
  }

  type MemberImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type MemberImportingLogPageData {
    data: [MemberImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
