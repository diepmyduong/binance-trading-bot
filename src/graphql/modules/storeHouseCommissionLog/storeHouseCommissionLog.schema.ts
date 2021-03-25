import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllStoreHouseCommissionLog(q: QueryGetListInput): StoreHouseCommissionLogPageData
    getOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
    getFilteredStoreHouseCommissionLog(q: QueryGetListInput): FilteredStorehouseCommissionLogPageData
    getOverviewStoreHouseCommissionLog(q: QueryGetListInput): OverviewStorehouseCommissionLogReport
    # Add Query
  }

  type OverviewStorehouseCommissionLogReport{
    commission: Float
    memberCount: Int
  }

  type FilteredStorehouseCommissionLog {
    phone: String
    memberId: String
    member: Member
    orderIds: [ID]
    orders: [Order]
    total:Float
  }

  type FilteredStorehouseCommissionLogPageData {
    data: [FilteredStorehouseCommissionLog]
    total: Int
    pagination: Pagination
  }

  extend type Mutation {
    deleteOneStoreHouseCommissionLog(id: ID!): StoreHouseCommissionLog
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
