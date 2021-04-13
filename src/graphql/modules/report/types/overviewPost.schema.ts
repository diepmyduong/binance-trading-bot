import { gql } from "apollo-server-express";

const schema = gql`
  extend type Query {
    getPostReports(q: QueryGetListInput): OverviewPostPageData 
    getPostReportsOverview(fromDate: String, toDate: String, memberId: ID): OverviewPostsReport 
    # Add Query
  }

  
  type CustomerStats{
    "Số lượng khách hàng"
    customersCount: Int
  }


  type CollaboratorStats{
    "Số lượng cộng tác viên"
    collaboratorsCount: Int
    "Số lượng khách hàng CTV"
    customersAsCollaboratorCount: Int
  }

  type MemberStatistics{
    "Số lượng khách hàng"
    customersCount: Int
    "Số lượng cộng tác viên"
    collaboratorsCount: Int
    "Số lượng khách hàng CTV"
    customersAsCollaboratorCount: Int
    "Số lượng đơn hàng"
    ordersCount: Int
    "Số lượng Đơn hàng chờ"
    pendingCount: Int
    "Số lượng Đơn hàng xác nhận"
    confirmedCount: Int
    "Số lượng Đơn hàng giao"
    deliveringCount: Int
    "Số lượng Đơn hàng thành công"
    completedCount: Int
    "Số lượng Đơn hàng không thành công"
    failureCount: Int
    "Số lượng Đơn hàng bị huỷ"
    canceledCount: Int
    "Tổng hoa hồng dự kiến"
    estimatedCommission: Float
    "Tổng hoa hồng thực nhận"
    realCommission: Float
    "Doanh thu dự kiến"
    estimatedIncome: Float
    "Doanh thu thực nhận"
    income: Float
    
  }

  type OverviewPostsReport {
    "Tổng doanh thu"
    totalIncome: Float
    "Tổng số CTV"
    totalCollaboratorsCount: Int
    "Số lượng CTV là khách hàng"
    collaboratorsAsCustomerCount:Int
    "Tổng hoa hồng đã nhận"
    totalRealCommission: Float
    "Tổng số bưu cục"
    totalMembersCount: Int
    "Tổng đơn hàng"
    totalOrdersCount: Int
  }

  type OverviewPost {
    id: String
    "Mã bưu cục"
    code: String
    "Hình Fanpage"
    fanpageImage: String
    "Tên cửa hàng"
    shopName: String
    "Địa chỉ"
    address: String
    "Mã Tỉnh/thành"
    provinceId: String
    "Mã Quận/huyện"
    districtId: String
    "Mã Phường/xã"
    wardId: String
    "Tỉnh/thành"
    province: String
    "Quận/huyện"
    district: String
    "Phường/xã"
    ward: String
    "Doanh thu"
    income: Float
    "Hoa hồng"
    commission: Float
    "Lần đăng nhập gần nhất"
    lastLoginDate: Mixed
    memberStatistics(fromDate: String, toDate: String): MemberStatistics
    collaboratorStats(fromDate: String, toDate: String): CollaboratorStats
    customerStats(fromDate: String, toDate: String): CustomerStats 
  }

  type OverviewPostPageData {
    data: [OverviewPost]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;

// aeon tan phu