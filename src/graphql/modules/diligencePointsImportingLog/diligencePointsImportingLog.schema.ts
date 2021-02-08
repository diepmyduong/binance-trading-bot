import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllDiligencePointsImportingLog(q: QueryGetListInput): DiligencePointsImportingLogPageData
    getOneDiligencePointsImportingLog(id: ID!): DiligencePointsImportingLog
    # Add Query
  }

  extend type Mutation {
    createDiligencePointsImportingLog(data: CreateDiligencePointsImportingLogInput!): DiligencePointsImportingLog
    updateDiligencePointsImportingLog(id: ID!, data: UpdateDiligencePointsImportingLogInput!): DiligencePointsImportingLog
    deleteOneDiligencePointsImportingLog(id: ID!): DiligencePointsImportingLog
    # Add Mutation
  }

  input CreateDiligencePointsImportingLogInput {
    name: String
  }

  input UpdateDiligencePointsImportingLogInput {
    name: String
  }

  type DiligencePointsImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type DiligencePointsImportingLogPageData {
    data: [DiligencePointsImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
