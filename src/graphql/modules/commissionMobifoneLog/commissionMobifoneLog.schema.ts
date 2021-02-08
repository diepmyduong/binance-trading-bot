import { gql } from "apollo-server-express";
import { CommissionMobifoneLogType } from "./commissionMobifoneLog.model";

const schema = gql`
  extend type Query {
    getAllCommissionMobifoneLog(q: QueryGetListInput): CommissionMobifoneLogPageData
  }

  type CommissionMobifoneLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    memberId: ID
    "Giá trị"
    value: Float
    "Loại sự kiện ${Object.values(CommissionMobifoneLogType)}"
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

  type CommissionMobifoneLogPageData {
    data: [CommissionMobifoneLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
