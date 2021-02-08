import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressDelivery(q: QueryGetListInput): AddressDeliveryPageData
    getOneAddressDelivery(id: ID!): AddressDelivery
    # Add Query
  }

  extend type Mutation {
    createAddressDelivery(data: CreateAddressDeliveryInput!): AddressDelivery
    updateAddressDelivery(id: ID!, data: UpdateAddressDeliveryInput!): AddressDelivery
    deleteOneAddressDelivery(id: ID!): AddressDelivery
    # Add Mutation
  }

  input CreateAddressDeliveryInput {
    "Tên địa điểm"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ"
    address: String!
    "Mã Phường/xã"
    wardId: String!
    "Mã Quận/huyện"
    districtId: String!
    "Mã Tỉnh/thành"
    provinceId: String!
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
  }

  input UpdateAddressDeliveryInput {
    "Tên giao nhận"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ"
    address: String!
    "Mã Phường/xã"
    wardId: String!
    "Mã Quận/huyện"
    districtId: String!
    "Mã Tỉnh/thành"
    provinceId: String!
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
  }

  type AddressDelivery {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Tên giao nhận"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ"
    address: String!
    "Mã Phường/xã"
    wardId: String!
    "Mã Quận/huyện"
    districtId: String!
    "Mã Tỉnh/thành"
    provinceId: String!
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
  }

  type AddressDeliveryPageData {
    data: [AddressDelivery]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
