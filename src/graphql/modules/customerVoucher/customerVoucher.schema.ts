import { gql } from "apollo-server-express";
import { CustomerVoucherStatus } from "./customerVoucher.model";

const schema = gql`
  extend type Query {
    getAllCustomerVoucher(q: QueryGetListInput): CustomerVoucherPageData
    getOneCustomerVoucher(id: ID!): CustomerVoucher
    # Add Query
  }

  type CustomerVoucher {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Mã"
    code: String
    "Mã chủ shop"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Mã voucher"
    voucherId: ID
    "Mã voucher"
    voucherCode: String
    "Số lượng phát hành"
    issueNumber: Int
    "Số lượng đã sử dụng"
    used: Int
    "Ngày hết hạng"
    expiredDate: DateTime
    "Trạng thái voucher ${Object.values(CustomerVoucherStatus)}"
    status: String
    "Lịch sử sử dụng"
    logs: [CustomerVoucherLog]

    voucher: ShopVoucher
  }

  type CustomerVoucherPageData {
    data: [CustomerVoucher]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
