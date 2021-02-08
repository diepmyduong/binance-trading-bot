import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllEVoucher(q: QueryGetListInput): EVoucherPageData
    getOneEVoucher(id: ID!): EVoucher
    # Add Query
  }

  extend type Mutation {
    deleteOneEVoucher(id: ID!): EVoucher
    importEVoucher(file: Upload!): Mixed
    # Add Mutation
  }

  type EVoucher {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã voucher"
    code: String!
    "Tên voucher"
    name: String!
    "Thông tin voucher"
    desc: String
    "Chi tiết voucher"
    eVoucherItems: [EVoucherItem]
    "Số lượng evoucher"
    itemCount: Int
    "Số lượng evoucher đã sử dụng"
    usedCount: Int
    "Số lượng evoucher chưa sử dụng"
    unUsedCount: Int
  }

  type EVoucherPageData {
    data: [EVoucher]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
