import { gql } from "apollo-server-express";
import { CumulativePointLogType } from "./cumulativePointLog.model";

const schema = gql`
  extend type Query {
    getAllCumulativePointLog(q: QueryGetListInput): CumulativePointLogPageData
  }

  type CumulativePointLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Giá trị"
    value: String
    "Loại sự kiện ${Object.values(CumulativePointLogType)}"
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

  type CumulativePointLogPageData {
    data: [CumulativePointLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
