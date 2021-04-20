import { gql } from "apollo-server-express";
import { ProductType } from "../../product/product.model";

const schema = gql`
  extend type Query {
    getProductReports(q: QueryGetListInput): OverviewProductPageData 
    getProductReportsOverview(fromDate: String, toDate: String, memberId: ID): OverviewProductReport 
    # Add Query
  }


  type ProductStats{
    "Tổng sản lượng"
    totalQty: Int
    "Sản lượng chờ duyệt"
    pendingQtyCount: Int
    "Sản lượng xác nhận"
    confirmedQtyCount: Int
    "Sản lượng đang giao"
    deliveringQtyCount: Int
    "Sản lượng hoàn thành"
    completedQtyCount: Int
    "Sản lượng không hoàn thành"
    failureQtyCount: Int
    "Sản lượng huỷ"
    canceledQtyCount: Int
    
    "Số lượng đơn"
    orderCount: Int
    "Số lượng đơn chờ duyệt"
    pendingCount: Int
    "Số lượng đơn xác nhận"
    confirmedCount: Int
    "Số lượng đơn đang giao"
    deliveringCount: Int
    "Số lượng đơn hoàn thành"
    completedCount: Int
    "Số lượng đơn thất bại"
    failureCount: Int
    "Số lượng đơn huỷ"
    canceledCount: Int
    
    "Tổng tiền hàng"
    totalAmount: Float
    "Tiền hàng chờ duyệt"
    pendingAmount: Float
    "Tiền hàng xác nhận"
    confirmedAmount: Float
    "Tiền hàng xác nhận"
    deliveringAmount: Float
    "Doanh thu"
    completedAmount: Float
    "Tiền hàng thất bại"
    failureAmount: Float
    "Tiền hàng huỷ"
    canceledAmount: Float
  }

  type TopProduct{
    name: String
    value: String
    unit: String
  }

  type OverviewProductReport {
    "Top 5 sản phẩm đựợc mua nhiều nhất"
    mostInterestedProducts: [TopProduct]
    "Top 5 sản phẩm doanh thu nhiều nhất"
    mostIncomeProducts: [TopProduct]
    "Top 5 sản phẩm hoa hồng nhiều nhất"
    mostCommissionProducts: [TopProduct]
    "Top 5 sản phẩm được xem nhiều nhất"
    mostViewProducts: [TopProduct]
  }

  type OverviewProduct {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    "Mã sản phẩm"
    code: String
    "Tên sản phẩm"
    name: String
    "Sản phẩm chính"
    isPrimary: Boolean
    "Gía bán"
    basePrice: Float
    "Mô tả ngắn"
    subtitle: String
    "Giới thiệu sản phẩm"
    intro: String
    "Hình ảnh đại diện"
    image: String
    "Hoa hồng VNPOST"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng cộng tác viên"
    commission2: Float
    "Hoa hồng kho"
    commission3: Float
    "Hoa hồng CHO ĐIỂM BÁN"
    baseCommission: Float
    "Thưởng cho điểm bán"
    enabledMemberBonus: Boolean
    "Thưởng cho khách hàng"
    enabledCustomerBonus: Boolean
    "Hệ số thưởng điểm bán"
    memberBonusFactor: Int
    "Hệ số thưởng khách hàng"
    customerBonusFactor: Int
    "Danh mục sản phẩm"
    categoryId: ID
    "Độ ưu tiên"
    priority:Int
    "Mở bán"
    allowSale: Boolean
    "Mã thành viên quản lý sản phẩm"
    memberId: ID
    "Hết hàng"
    outOfStock: Boolean
    #delivery
    "Chiều rộng"
    width: Int
    "Chiều dài"
    length: Int
    "Chiều cao"
    height: Int
    "Cân nặng"
    weight: Int
    "Thống kê Sản phẩm"
    productStats(fromDate: String, toDate: String, memberIds: [ID]):ProductStats
    category: Category
  }

  type OverviewProductPageData {
    data: [OverviewProduct]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;