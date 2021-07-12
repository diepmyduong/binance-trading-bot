import { gql } from "apollo-server-express";
import { CustomerCommissionLogType } from "./customerCommissionLog.model";

const schema = gql`
  extend type Query {
    getAllCustomerCommissionLog(q: QueryGetListInput): CustomerCommissionLogPageData
    getAllMemberCollaboratorCommissionLog(q: QueryGetListInput): MemberCollaboratorCommissionLogPageData
  }

  type MemberCollaboratorCommissionLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Giá trị"
    value: String
    "Mã đơn hàng"
    orderId: ID
    "Ghi chú"
    note: String
    "Mã cửa hàng ctv"
    returnMemberId : ID

    order: Order
    returnMember: Member
  }

  type MemberCollaboratorCommissionLogPageData {
    data: [MemberCollaboratorCommissionLog]
    total: Int
    pagination: Pagination
  }

  type CustomerCommissionLog {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã thành viên"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Mã cộng tác viên"
    collaboratorId: ID
    "Giá trị"
    value: String
    "Loại sự kiện ${Object.values(CustomerCommissionLogType).join("|")}"
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
    member: Member
    customer: Customer
    collaborator: Collaborator

    returnMemberId : ID
  }

  type CustomerCommissionLogPageData {
    data: [CustomerCommissionLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
