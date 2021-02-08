import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllEVoucherItem(q: QueryGetListInput): EVoucherItemPageData
    getOneEVoucherItem(id: ID!): EVoucherItem
    # Add Query
  }

  extend type Mutation {
    deleteOneEVoucherItem(id: ID!): EVoucherItem
    deleteAllEvoucherItems(
      eVoucherId: ID!
      onlyDeleteUnused: Boolean!
    ): DeleteAllEvoucherItemsData
    # Add Mutation
  }

  type DeleteAllEvoucherItemsData {
    deletedCount: Int
    remainCount: Int
  }

  type EVoucherItem {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    name: String
    code: String!
    eVoucherId: ID!
    activated: Boolean
    eVoucher: EVoucher
    customer: Customer
    luckyWheel: LuckyWheel
  }

  type EVoucherItemPageData {
    data: [EVoucherItem]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
