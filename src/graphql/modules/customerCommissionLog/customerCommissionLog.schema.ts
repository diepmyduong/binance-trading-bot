import { gql } from "apollo-server-express";
import { CustomerCommissionLogType } from "./customerCommissionLog.model";

const schema = gql`
  extend type Query {
    getAllCustomerCommissionLog(q: QueryGetListInput): CustomerCommissionLogPageData

  }

  type CustomerCommissionLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Giá trị"
    value: String
    "Loại sự kiện ${Object.values(CustomerCommissionLogType).join('|')}"
    type: String
    "Mã đơn hàng"
    orderId: ID
    "Mã đăng ký SMS"
    regisSMSId: ID
    "Mã đăng ký dịch vụ"
    regisServiceId: ID
    "Ghi chú"
    note: String

    order: Order
    regisSMS: RegisSMS
    regisService: RegisService
    
  }

  type CustomerCommissionLogPageData {
    data: [CustomerCommissionLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
