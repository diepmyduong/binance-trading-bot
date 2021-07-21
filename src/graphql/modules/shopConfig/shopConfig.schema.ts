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
    "Đánh giá sao"
    rating: Float
    "Số lượng đánh giá"
    ratingQty: Int
    "Số lượng đã bán"
    soldQty: Int
    "Tiêu đề Upsale"
    upsaleTitle: String
    "Bật tin nhắn đơn hàng"
    smsOrder: Boolean
    "Bạt tin nhắn OTP"
    smsOtp: Boolean
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
    "Đánh giá sao"
    rating: Float
    "Số lượng đánh giá"
    ratingQty: Int
    "Số lượng đã bán"
    soldQty: Int
    "Tiêu đề Upsale"
    upsaleTitle: String
    "Bật tin nhắn đơn hàng"
    smsOrder: Boolean
    "Bạt tin nhắn OTP"
    smsOtp: Boolean
  }
`;

export default schema;
