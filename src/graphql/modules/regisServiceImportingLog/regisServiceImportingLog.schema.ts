import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllRegisServiceImportingLog(q: QueryGetListInput): RegisServiceImportingLogPageData
    getOneRegisServiceImportingLog(id: ID!): RegisServiceImportingLog
    # Add Query
  }

  extend type Mutation {
    createRegisServiceImportingLog(data: CreateRegisServiceImportingLogInput!): RegisServiceImportingLog
    updateRegisServiceImportingLog(id: ID!, data: UpdateRegisServiceImportingLogInput!): RegisServiceImportingLog
    deleteOneRegisServiceImportingLog(id: ID!): RegisServiceImportingLog
    # Add Mutation
  }

  input CreateRegisServiceImportingLogInput {
    name: String
  }

  input UpdateRegisServiceImportingLogInput {
    name: String
  }

  type RegisServiceImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type RegisServiceImportingLogPageData {
    data: [RegisServiceImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
