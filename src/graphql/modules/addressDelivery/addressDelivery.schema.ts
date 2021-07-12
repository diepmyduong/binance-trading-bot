import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllAddressDelivery(q: QueryGetListInput): AddressDeliveryPageData
    getOneAddressDelivery(id: ID!): AddressDelivery
    getShopAddressDelivery(
      provinceId: ID
      districtId: ID
      wardId: ID
      sellerId: ID
    ): [AddressDelivery]
    # Add Query
  }

  extend type Mutation {
    createAddressDelivery(data: CreateAddressDeliveryInput!): AddressDelivery
    updateAddressDelivery(id: ID!, data: UpdateAddressDeliveryInput!): AddressDelivery
    deleteOneAddressDelivery(id: ID!): AddressDelivery
    importAddressDelivery(file: Upload!): String
    # Add Mutation
  }

  input CreateAddressDeliveryInput {
    "Mã địa điểm"
    code: String
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
    "Hiệu lực"
    activated: Boolean
  }

  input UpdateAddressDeliveryInput {
    "Tên giao nhận"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ"
    address: String
    "Mã Phường/xã"
    wardId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "Hiệu lực"
    activated: Boolean
  }

  type AddressDelivery {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    "Mã địa điểm"
    code: String
    "Tên giao nhận"
    name: String
    "Số điện thoại"
    phone: String
    "Email liên hệ"
    email: String
    "Địa chỉ"
    address: String
    "Mã Phường/xã"
    wardId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "Hiệu lực"
    activated: Boolean

    "Cửa hàng"
    member: Member
  }

  type AddressDeliveryPageData {
    data: [AddressDelivery]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
