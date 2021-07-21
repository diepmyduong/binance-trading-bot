import { gql } from "apollo-server-express";
import { Gender } from "../member/member.model";
import { ShopRegistionStatus } from "./shopRegistration.model";

const schema = gql`
  extend type Query {
    getAllShopRegistration(q: QueryGetListInput): ShopRegistrationPageData
    getOneShopRegistration(id: ID!): ShopRegistration
    # Add Query
  }

  extend type Mutation {
    createShopRegistration(data: CreateShopRegistrationInput!): ShopRegistration
  }

  input CreateShopRegistrationInput {
     "Email"
     email: String
    "Số điện thoại"
    phone: String
    "Họ tên"
    name: String
    "Mã cửa hàng"
    shopCode: String
    "Tên cửa hàng"
    shopName: String
    "Logo cửa hàng"
    shopLogo: String
    "Địa chỉ"
    address: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Phường/xã"
    wardId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "Ngày sinh"
    birthday: DateTime
    "Giới tính ${Object.values(Gender)}"
    gender: String
    "Trạng thái ${Object.values(ShopRegistionStatus)}"
    status: String
    "Ngày duyệt"
    approvedAt: DateTime
    "Ngày từ chối"
    rejectedAt: DateTime
    "Tài khoản chủ shop"
    memberId: ID
  }

  type ShopRegistration {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Email"
    email: String
    "Số điện thoại"
    phone: String
    "Họ tên"
    name: String
    "Mã cửa hàng"
    shopCode: String
    "Tên cửa hàng"
    shopName: String
    "Logo cửa hàng"
    shopLogo: String
    "Địa chỉ"
    address: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Phường/xã"
    wardId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "Ngày sinh"
    birthday: DateTime
    "Giới tính ${Object.values(Gender)}"
    gender: String
    "Trạng thái ${Object.values(ShopRegistionStatus)}"
    status: String
    "Ngày duyệt"
    approvedAt: DateTime
    "Ngày từ chối"
    rejectedAt: DateTime
    "Tài khoản chủ shop"
    memberId: ID
  }

  type ShopRegistrationPageData {
    data: [ShopRegistration]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
