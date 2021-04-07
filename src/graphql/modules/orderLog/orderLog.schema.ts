import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllOrderLog(q: QueryGetListInput): OrderLogPageData
    getAllToMemberOrderLog(q: QueryGetListInput): OrderLogPageData
    getOneOrderLog(id: ID!): OrderLog
    # Add Query
  }

  type OrderLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    orderId: ID
    type: String
    memberId: ID
    toMemberId: ID
    customerId: ID
    note: String
    statusText: String

    order: Order
    member: Member
    toMember: Member
    customer: Customer
  }

  type OrderLogPageData {
    data: [OrderLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
