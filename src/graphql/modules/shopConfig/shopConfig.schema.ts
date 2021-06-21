import { gql } from "apollo-server-express";

const schema = gql`
  extend type Mutation {
    updateShopConfig(id: ID!, data: UpdateShopConfigInput!): ShopConfig
    # Add Mutation
  }

  input UpdateShopConfigInput {
    "Thời gian chuẩn bị"
    shipPreparationTime: String
    "Khoản cách giao hàng mặc định"
    shipDefaultDistance: Int
    "Phí giao hàng mặc định"
    shipDefaultFee: Float
    "Phí ship cộng thêm mỗi km"
    shipNextFee: Float
    "Phí ship dưới 1 km"
    shipOneKmFee: Float
    "Bật phí ship dưới 1 km"
    shipUseOneKmFee: Boolean
    "Ghi chú cho shipper"
    shipNote: String
  }

  type ShopConfig {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã CRM VNPost"
    vnpostCode: String
    "Điện thoại VNPost"
    vnpostPhone: String
    "Tên người dùng VNPost"
    vnpostName: String
    "Thời gian chuẩn bị"
    shipPreparationTime: String
    "Khoản cách giao hàng mặc định"
    shipDefaultDistance: Int
    "Phí giao hàng mặc định"
    shipDefaultFee: Float
    "Phí ship cộng thêm mỗi km"
    shipNextFee: Float
    "Phí ship dưới 1 km"
    shipOneKmFee: Float
    "Bật phí ship dưới 1 km"
    shipUseOneKmFee: Boolean
    "Ghi chú cho shipper"
    shipNote: String
  }
`;

export default schema;
