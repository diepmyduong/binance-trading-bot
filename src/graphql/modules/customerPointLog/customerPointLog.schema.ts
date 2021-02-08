import { gql } from "apollo-server-express";
import { CustomerPointLogType } from "./customerPointLog.model";

const schema = gql`
  extend type Query {
    getAllCustomerPointLog(q: QueryGetListInput): CustomerPointLogPageData
  }

  type CustomerPointLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    customerId: ID
    "Giá trị"
    value: Float
    "Loại sự kiện ${Object.values(CustomerPointLogType)}"
    type: String
    "Mã đơn hàng"
    orderId: ID
    "Mã đăng ký SMS"
    regisSMSId: ID
    "Mã đăng ký dịch vụ"
    regisServiceId: ID
    "Mã lịch sử quay vòng quay may mắn"
    luckyWheelResultId: ID
    "Loại sự kiện"
    note: String
    order:Order
    regisSMS:RegisSMS
    regisService:RegisService
    luckyWheelResult:LuckyWheelResult
  }

  type CustomerPointLogPageData {
    data: [CustomerPointLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
