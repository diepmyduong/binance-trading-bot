import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCustomerGroup(q: QueryGetListInput): CustomerGroupPageData
    getOneCustomerGroup(id: ID!): CustomerGroup
    # Add Query
  }

  extend type Mutation {
    createCustomerGroup(data: CreateCustomerGroupInput!): CustomerGroup
    updateCustomerGroup(id: ID!, data: UpdateCustomerGroupInput!): CustomerGroup
    deleteOneCustomerGroup(id: ID!): CustomerGroup
    # Add Mutation
  }

  input CreateCustomerGroupInput {
    "Tên nhóm"
    name: String
    "Bộ lọc"
    filter: Mixed
  }

  input UpdateCustomerGroupInput {
    "Tên nhóm"
    name: String
    "Bộ lọc"
    filter: Mixed
  }

  type CustomerGroup {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Tên nhóm"
    name: String
    "Bộ lọc"
    filter: Mixed
    "Tổng số KH"
    summary: Int
  }

  type CustomerGroupPageData {
    data: [CustomerGroup]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
