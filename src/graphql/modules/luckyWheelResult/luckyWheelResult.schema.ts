import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllLuckyWheelResult(q: QueryGetListInput): LuckyWheelResultPageData
    # Add Query
  }

  type LuckyWheelResult {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "mã khách hàng"
    customerId: ID
    "mã vòng quay"
    luckyWheelId: ID
    "Mã quà"
    code: String
    "Quà"
    gift: Gift

    customer: Customer
    voucher: CustomerVoucher
  }

  type LuckyWheelResultPageData {
    data: [LuckyWheelResult]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
