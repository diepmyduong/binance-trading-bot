import { gql } from "apollo-server-express";
import { ShopVoucherType, DiscountUnit } from "./shopVoucher.model";

const schema = gql`
  extend type Query {
    getAllShopVoucher(q: QueryGetListInput): ShopVoucherPageData
    getOneShopVoucher(id: ID!): ShopVoucher
    # Add Query
  }

  extend type Mutation {
    createShopVoucher(data: CreateShopVoucherInput!): ShopVoucher
    updateShopVoucher(id: ID!, data: UpdateShopVoucherInput!): ShopVoucher
    deleteOneShopVoucher(id: ID!): ShopVoucher
    # Add Mutation
  }

  input CreateShopVoucherInput {

    "Mã khuyến mãi"
    code: String!
    "Mô tả"
    description: String!
    "Loại giảm giá ${Object.values(ShopVoucherType)}"
    type: String!
  }

  input UpdateShopVoucherInput {
    "Mô tả"
    description: String
    "Kích hoạt"
    isActive: Boolean
    "Số lượng phát hành"
    issueNumber: Int
    "Phát hành mỗi ngày"
    issueByDate: Boolean
    "Số lượng sử dụng / mỗi khách"
    useLimit: Int
    "Số lượng sử dụng theo ngày"
    useLimitByDate: Boolean
    "Đơn vị giảm giá ${Object.values(DiscountUnit)}"
    discountUnit: String
    "Giá trị giảm giá"
    discountValue: Float
    "Giảm giá tối đa"
    maxDiscount: Float
    "Sản phẩm quà tặng"
    offerItems: [OfferItemInput]
    "Sản phẩm giảm giá"
    discountItems: [DiscountItemInput]
    "Các sản phẩm áp dụng"
    applyItemIds: [ID]
    "Các sản phẩm không áp dụng"
    exceptItemIds: [ID]
    "Tổng tiền hàng tối thiểu"
    minSubtotal: Float
    "Phương thức thanh toán áp dụng"
    applyPaymentMethods: [String]
    "Số lượng sản phẩm tối thiểu"
    minItemQty: Int
    "Ngày bắt đầu"
    startDate: DateTime
    "Ngày kết thúc"
    endDate: DateTime
    "Mã giảm giá riêng tư"
    isPrivate: Boolean
  }

  type ShopVoucher {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Mã chủ shop"
    memberId: ID
    "Mã khuyến mãi"
    code: String
    "Mô tả"
    description: String
    "Kích hoạt"
    isActive: Boolean
    "Loại giảm giá ${Object.values(ShopVoucherType)}"
    type: String
    "Số lượng phát hành"
    issueNumber: Int
    "Phát hành mỗi ngày"
    issueByDate: Boolean
    "Số lượng sử dụng / mỗi khách"
    useLimit: Int
    "Số lượng sử dụng theo ngày"
    useLimitByDate: Boolean
    "Đơn vị giảm giá ${Object.values(DiscountUnit)}"
    discountUnit: String
    "Giá trị giảm giá"
    discountValue: Float
    "Giảm giá tối đa"
    maxDiscount: Float
    "Sản phẩm quà tặng"
    offerItems: [OfferItem]
    "Sản phẩm giảm giá"
    discountItems: [DiscountItem]
    "Các sản phẩm áp dụng"
    applyItemIds: [ID]
    "Các sản phẩm không áp dụng"
    exceptItemIds: [ID]
    "Tổng tiền hàng tối thiểu"
    minSubtotal: Float
    "Phương thức thanh toán áp dụng"
    applyPaymentMethods: [String]
    "Số lượng sản phẩm tối thiểu"
    minItemQty: Int
    "Ngày bắt đầu"
    startDate: DateTime
    "Ngày kết thúc"
    endDate: DateTime
    "Mã giảm giá riêng tư"
    isPrivate: Boolean
  }

  type ShopVoucherPageData {
    data: [ShopVoucher]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
