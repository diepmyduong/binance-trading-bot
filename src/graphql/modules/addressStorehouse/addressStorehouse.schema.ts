import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressStorehouse(q: QueryGetListInput): AddressStorehousePageData
    getOneAddressStorehouse(id: ID!): AddressStorehouse
    # Add Query
  }

  extend type Mutation {
    createAddressStorehouse(
      data: CreateAddressStorehouseInput!
    ): AddressStorehouse
    updateAddressStorehouse(
      id: ID!
      data: UpdateAddressStorehouseInput!
    ): AddressStorehouse
    deleteOneAddressStorehouse(id: ID!): AddressStorehouse
    importAddressStorehouses(file: Upload!): Mixed
    # Add Mutation
  }

  input CreateAddressStorehouseInput {
    "Tên kho"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ kho"
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

  input UpdateAddressStorehouseInput {
    "Tên kho"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ kho"
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

  type AddressStorehouse {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Tên kho"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ kho"
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

  type AddressStorehousePageData {
    data: [AddressStorehouse]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
