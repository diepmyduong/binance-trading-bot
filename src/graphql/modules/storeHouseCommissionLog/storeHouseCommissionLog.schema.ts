import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllStoreHouseCommissionLog(q: QueryGetListInput): StoreHouseCommissionLogPageData
    getOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    # Add Query
  }

  extend type Mutation {
    getTest(id: ID!): String
    # Add Mutation
  }

  type StoreHouseCommissionLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    memberId: String
    "Hoa hồng kho"
    value: Float
    "Đơn hàng"
    orderId: String
    "Ghi chú"
    note: String
    order: Order
    member: Member
  }

  type StoreHouseCommissionLogPageData {
    data: [StoreHouseCommissionLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
