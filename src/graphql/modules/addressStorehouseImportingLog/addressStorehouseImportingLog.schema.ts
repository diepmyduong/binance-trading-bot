import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressStorehouseImportingLog(q: QueryGetListInput): AddressStorehouseImportingLogPageData
    getOneAddressStorehouseImportingLog(id: ID!): AddressStorehouseImportingLog
    # Add Query
  }

  extend type Mutation {
    createAddressStorehouseImportingLog(data: CreateAddressStorehouseImportingLogInput!): AddressStorehouseImportingLog
    updateAddressStorehouseImportingLog(id: ID!, data: UpdateAddressStorehouseImportingLogInput!): AddressStorehouseImportingLog
    deleteOneAddressStorehouseImportingLog(id: ID!): AddressStorehouseImportingLog
    # Add Mutation
  }

  input CreateAddressStorehouseImportingLogInput {
    name: String
  }

  input UpdateAddressStorehouseImportingLogInput {
    name: String
  }

  type AddressStorehouseImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type AddressStorehouseImportingLogPageData {
    data: [AddressStorehouseImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
