import { gql } from "apollo-server-express";
import { MemberType } from "../member.model";

const schema = gql`
  extend type Query {
    getShopData: Shop
    # Add Query
  }

  type Shop {
    id: String
    "Mã chủ shop"
    username: String
    "UID Firebase"
    uid: String
    "Họ tên"
    name: String
    "Avatar"
    avatar: String
    "Điện thoại"
    phone: String
    "Mã Fanpage"
    fanpageId: String
    "Tên Fanpage"
    fanpageName: String
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
    "Điểm nhận hàng bưu cục"
    addressDelivery: AddressDelivery

    "Danh sách mã điểm nhận hàng"
    addressDeliveryIds: [ID]
    addressDeliverys: [AddressDelivery]

    "Danh sách mã kho"
    addressStorehouseIds: [ID]
    addressStorehouses: [AddressStorehouse]
    mainAddressStorehouseId: ID
    mainAddressStorehouse: AddressStorehouse
  }

  
`;

export default schema;

// aeon tan phu