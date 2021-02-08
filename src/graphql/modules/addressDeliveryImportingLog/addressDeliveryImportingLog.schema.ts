import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressDeliveryImportingLog(q: QueryGetListInput): AddressDeliveryImportingLogPageData
    getOneAddressDeliveryImportingLog(id: ID!): AddressDeliveryImportingLog
    # Add Query
  }

  extend type Mutation {
    createAddressDeliveryImportingLog(data: CreateAddressDeliveryImportingLogInput!): AddressDeliveryImportingLog
    updateAddressDeliveryImportingLog(id: ID!, data: UpdateAddressDeliveryImportingLogInput!): AddressDeliveryImportingLog
    deleteOneAddressDeliveryImportingLog(id: ID!): AddressDeliveryImportingLog
    # Add Mutation
  }

  input CreateAddressDeliveryImportingLogInput {
    name: String
  }

  input UpdateAddressDeliveryImportingLogInput {
    name: String
  }

  type AddressDeliveryImportingLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type AddressDeliveryImportingLogPageData {
    data: [AddressDeliveryImportingLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
