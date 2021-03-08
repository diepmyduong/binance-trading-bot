import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllProductImportingLog(q: QueryGetListInput): ProductImportingLogPageData
    getOneProductImportingLog(id: ID!): ProductImportingLog
    # Add Query
  }

  extend type Mutation {
    deleteOneProductImportingLog(id: ID!): ProductImportingLog
    # Add Mutation
  }

  input CreateProductImportingLogInput {
    name: String
  }

  input UpdateProductImportingLogInput {
    name: String
  }

  type ProductImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type ProductImportingLogPageData {
    data: [ProductImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
