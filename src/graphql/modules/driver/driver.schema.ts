import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllDriver(q: QueryGetListInput): DriverPageData
    getOneDriver(id: ID!): Driver
    # Add Query
  }

  extend type Mutation {
    createDriver(data: CreateDriverInput!): Driver
    updateDriver(id: ID!, data: UpdateDriverInput!): Driver
    deleteOneDriver(id: ID!): Driver
    # Add Mutation
  }

  input CreateDriverInput {
    "Tên tài xế"
    name: String!
    "Số điện thoại"
    phone: String!
    "Hình đại diện"
    avatar: String
    "Biển số xe"
    licensePlates: String!
  }

  input UpdateDriverInput {
    "Tên tài xế"
    name: String
    "Số điện thoại"
    phone: String
    "Hình đại diện"
    avatar: String
    "Biển số xe"
    licensePlates: String
  }

  type Driver {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Chủ shop"
    memberId: ID
    "Tên tài xế"
    name: String
    "Số điện thoại"
    phone: String
    "Hình đại diện"
    avatar: String
    "Biển số xe"
    licensePlates: String
  }

  type DriverPageData {
    data: [Driver]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
