import { gql } from "apollo-server-express";
import { MemberType } from "../member.model";

const schema = gql`
  extend type Query {
    getAllPosts(q: QueryGetListInput):PostPageData 
    # Add Query
  }

  type Post {
    id: String

    "Mã cửa hàng"
    code: String
    "Họ tên"
    name: String
    "Điện thoại"
    phone: String
    "Hình Fanpage"
    fanpageImage: String
    "Tên cửa hàng"
    shopName: String
    "Logo cửa hàng"
    shopLogo: String
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
    "Chủ shop đã kích hoạt"
    activated: Boolean
    "Loại chủ shop ${Object.values(MemberType).join("|")}"
    type: String
  }

  type PostPageData {
    data: [Post]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
