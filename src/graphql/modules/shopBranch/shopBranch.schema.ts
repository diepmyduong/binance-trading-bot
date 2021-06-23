import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getAllShopBranch(q: QueryGetListInput): ShopBranchPageData
    getOneShopBranch(id: ID!): ShopBranch
    # Add Query
  }

  extend type Mutation {
    createShopBranch(data: CreateShopBranchInput!): ShopBranch
    updateShopBranch(id: ID!, data: UpdateShopBranchInput!): ShopBranch
    deleteOneShopBranch(id: ID!): ShopBranch
    # Add Mutation
  }

  input CreateShopBranchInput {
    "Mã chi nhánh"
    code: String
    "Tên chi nhánh"
    name: String!
    "Số điện thoại"
    phone: String!
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
    "hiệu lực hay không hiệu lực"
    activated: Boolean
    "Toạ độ"
    location: Mixed!
    "Hình ảnh cover"
    coverImage: String
    "Mở cửa"
    isOpen: Boolean
  }

  input UpdateShopBranchInput {
    "Mã chi nhánh"
    code: String
    "Tên chi nhánh"
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
    "hiệu lực hay không hiệu lực"
    activated: Boolean
    "Toạ độ"
    location: Mixed
    "Hình ảnh cover"
    coverImage: String
    "Mở cửa"
    isOpen: Boolean
  }

  type ShopBranch {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã chi nhánh"
    code: String
    "Tên chi nhánh"
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
    "hiệu lực hay không hiệu lực"
    activated: Boolean
    "Toạ độ"
    location: Mixed
    "Hình ảnh cover"
    coverImage: String
    "Mở cửa"
    isOpen: Boolean
  }

  type ShopBranchPageData {
    data: [ShopBranch]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
