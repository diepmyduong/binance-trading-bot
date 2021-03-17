import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllOrderLog(q: QueryGetListInput): OrderLogPageData
    getOneOrderLog(id: ID!): OrderLog
    # Add Query
  }

  extend type Mutation {
    createOrderLog(data: CreateOrderLogInput!): OrderLog
    updateOrderLog(id: ID!, data: UpdateOrderLogInput!): OrderLog
    deleteOneOrderLog(id: ID!): OrderLog
    # Add Mutation
  }

  input CreateOrderLogInput {
    name: String
  }

  input UpdateOrderLogInput {
    name: String
  }

  type OrderLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    name: String
  }

  type OrderLogPageData {
    data: [OrderLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
