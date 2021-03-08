import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllRegisSMSImportingLog(q: QueryGetListInput): RegisSMSImportingLogPageData
    getOneRegisSMSImportingLog(id: ID!): RegisSMSImportingLog
    # Add Query
  }

  extend type Mutation {
    deleteOneRegisSMSImportingLog(id: ID!): RegisSMSImportingLog
    # Add Mutation
  }

  input CreateRegisSMSImportingLogInput {
    name: String
  }

  input UpdateRegisSMSImportingLogInput {
    name: String
  }

  type RegisSMSImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type RegisSMSImportingLogPageData {
    data: [RegisSMSImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
