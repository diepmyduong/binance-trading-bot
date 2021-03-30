import { gql } from "apollo-server-express";
import { MemberType } from "../../member/member.model";

const schema = gql`
  extend type Query {
    getPostReports(q: QueryGetListInput): OverviewPostPageData 
    getPostReportsOverview(q: QueryGetListInput): OverviewPostsReport 
    # Add Query
  }

  type MemberStatistics{
    income: Float
    collaboratorsCount: Int
    realCommission: Float
  }

  type OverviewPostsReport {
    commission: Float
    income: Float
    postCount: Int
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