import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressDelivery(q: QueryGetListInput): AddressDeliveryPageData
    getOneAddressDelivery(id: ID!): AddressDelivery
    # Add Query
  }

  extend type Mutation {
    createAddressDelivery(data: CreateAddressDeliveryInput!): AddressDelivery
    updateAddressDelivery(id: ID!, data: UpdateAddressDeliveryInput!): AddressDelivery
    deleteOneAddressDelivery(id: ID!): AddressDelivery
    # Add Mutation
  }

  input CreateAddressDeliveryInput {
    name: String
  }

  input UpdateAddressDeliveryInput {
    name: String
  }

  type AddressDelivery {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type AddressDeliveryPageData {
    data: [AddressDelivery]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
