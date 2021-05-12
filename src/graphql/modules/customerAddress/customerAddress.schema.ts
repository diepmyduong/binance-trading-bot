import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllCustomerAddress(q: QueryGetListInput): CustomerAddressPageData
    getOneCustomerAddress(id: ID!): CustomerAddress
    # Add Query
  }

  extend type Mutation {
    createCustomerAddress(data: CreateCustomerAddressInput!): CustomerAddress
    updateCustomerAddress(id: ID!, data: UpdateCustomerAddressInput!): CustomerAddress
    deleteOneCustomerAddress(id: ID!): CustomerAddress
    # Add Mutation
  }

  input CreateCustomerAddressInput {
    "Mã tỉnh/thành"
    provinceId: String!
    "Mã quận/huyện"
    districtId: String!
    "Mã phường/xã"
    wardId: String!
    "Địa chỉ"
    address: String
    "Địa chỉ mặc định"
    isDefault: Boolean
    "Toạ độ vị trí"
    location: Mixed
  }

  input UpdateCustomerAddressInput {
    "Mã tỉnh/thành"
    provinceId: String
    "Mã quận/huyện"
    districtId: String
    "Mã phường/xã"
    wardId: String
    "Địa chỉ"
    address: String
    "Địa chỉ mặc định"
    isDefault: Boolean
    "Toạ độ vị trí"
    location: Mixed
  }

  type CustomerAddress {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã khách hàng"
    customerId: ID
    "Mã tỉnh/thành"
    provinceId: String
    "Mã quận/huyện"
    districtId: String
    "Mã phường/xã"
    wardId: String
    "Tỉnh/ thành"
    province: String
    "Quận/ huyện"
    district: String
    "Phường/ xã"
    ward: String
    "Địa chỉ"
    address: String
    "Toạ độ vị trí"
    location: Mixed
    "Địa chỉ mặc định"
    isDefault: Boolean
  }

  type CustomerAddressPageData {
    data: [CustomerAddress]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
