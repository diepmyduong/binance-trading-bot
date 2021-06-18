import { gql } from "apollo-server-express";

const schema = gql`
  type OrderItem {
    id: String
    createdAt: DateTime
    updatedAt: DateTime

    "Mã đơn hàng"
    orderId: ID
    "Mã người bán"
    sellerId: ID
    "Mã người mua"
    buyerId: ID
    "Sản phẩm chính của Mobifone"
    isPrimary: Boolean
    "Sản phẩm"
    productId: ID
    "Tên sản phẩm"
    productName: String
    "Giá bán"
    basePrice: Float
    "Số lượng"
    qty: Int
    "Hoa hồng Mobifone"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng giới thiệu"
    commission2: Float
    "Điểm thường người bán"
    sellerBonusPoint: Float
    "Điểm thưởng người mua"
    buyerBonusPoint: Float
    "Thành tiền"
    amount: Float
    "Mã chiến dịch"
    campaignId: ID
    "Mã kết quả chiến dịch"
    campaignSocialResultId: String

    product: Product
    campaign: Campaign
    campaignSocialResult: CampaignSocialResult
  }

  type OrderItemPageData {
    data: [OrderItem]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
