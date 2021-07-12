import { gql } from "apollo-server-express";
import { StaffScope } from "./staff.model";

const schema = gql`
  extend type Query {
    getAllStaff(q: QueryGetListInput): StaffPageData
    getOneStaff(id: ID!): Staff
    # Add Query
  }

  extend type Mutation {
    createStaff(data: CreateStaffInput!): Staff
    updateStaff(id: ID!, data: UpdateStaffInput!): Staff
    deleteOneStaff(id: ID!): Staff
    # Add Mutation
  }

  input CreateStaffInput {
    "Tên đăng nhập"
    username: String!
    "Mật khẩu"
    password: String!
    "Tên nhân viên"
    name: String!
    "Mã chi nhánh"
    branchId: ID!
    "Điện thoại nhân viên"
    phone: String
    "Ảnh đại diện"
    avatar: String
    "Địa chỉ liên hệ"
    address: String
    "Danh sách phân quyền ${Object.values(StaffScope)}"
    scopes: [String]
  }

  input UpdateStaffInput {
    "Tên đăng nhập"
    username: String
    "Tên nhân viên"
    name: String
    "Điện thoại nhân viên"
    phone: String
    "Ảnh đại diện"
    avatar: String
    "Địa chỉ liên hệ"
    address: String
    "Mã chi nhánh"
    branchId: ID
    "Danh sách phân quyền ${Object.values(StaffScope)}"
    scopes: [String]
  }

  type Staff {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Tên đăng nhập"
    username: String
    "Tên nhân viên"
    name: String
    "Điện thoại nhân viên"
    phone: String
    "Ảnh đại diện"
    avatar: String
    "Địa chỉ liên hệ"
    address: String
    "Mã chi nhánh"
    branchId: ID
    "Danh sách phân quyền ${Object.values(StaffScope)}"
    scopes: [String]

    branch: ShopBranch
  }

  type StaffPageData {
    data: [Staff]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
