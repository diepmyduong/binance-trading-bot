import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllStoreHouseCommissionLog(q: QueryGetListInput): StoreHouseCommissionLogPageData
    getOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    # Add Query
  }

  extend type Mutation {
    deleteOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    # Add Mutation
  }

  input CreateStoreHouseCommissionLogInput {
    name: String
  }

  input UpdateStoreHouseCommissionLogInput {
    name: String
  }

  type StoreHouseCommissionLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type StoreHouseCommissionLogPageData {
    data: [StoreHouseCommissionLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
