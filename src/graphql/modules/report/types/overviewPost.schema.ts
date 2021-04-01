import { gql } from "apollo-server-express";
import { MemberType } from "../../member/member.model";

const schema = gql`
  extend type Query {
    getPostReports(q: QueryGetListInput): OverviewPostPageData 
    getPostReportsOverview(fromDate: String!, toDate: String!): OverviewPostsReport 
    # Add Query
  }

  type MemberStatistics{
    "Từ ngày"
    fromDate: String
    "Đến ngày"
    toDate: String
    "Doanh thu"
    income: Float
    "Số lượng CTV"
    collaboratorsCount: Int
    "Hoa hồng đã nhận"
    realCommission: Float
    "Hoa hồng sẽ nhận"
    estimatedCommission: Float
  }

  type OverviewPostsReport {
    "Từ ngày"
    fromDate: String
    "Đến ngày"
    toDate: String
    "Tổng doanh thu"
    totalIncome: Float
    "Tổng số CTV"
    totalCollaboratorsCount: Int
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

    memberStatistics: MemberStatistics
  }

  type OverviewPostPageData {
    data: [OverviewPost]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;

// aeon tan phu