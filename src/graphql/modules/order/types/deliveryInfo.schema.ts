import { gql } from "apollo-server-express";
import { OfflineServices, VietnamPostHelper } from "../../../../helpers";

export default gql`
  type DeliveryInfo {
    "Ngày giao hàng"
    date: DateTime
    "Kho giao hàng"
    storeId: ID
    "Mã Dịch vụ giao hàng ${OfflineServices.map(s=>`${s.code}-${s.name}`).join('|')}"
    serviceId: String
    "Tên Dịch vụ giao hàng"
    serviceName: String
    "Phí giao hàng trả cho đối tác"
    partnerFee: Float
    "Mã vận đơn"
    orderNumber: String
    "Trạng thái giao hàng"
    status: String
    "Tên tình trạng"
    statusName: String
    "Ghi chú giao hàng"
    note: String
    "Thời gian dự kiến"
    time: String
    "Tiền thu hộ"
    moneyCollection: Float
    "Nội dung hàng hóa"
    productName: String
    "Trọng lượng (gr)"
    productWeight: Float
    "Chiều dài (cm)"
    productLength: Float
    "Chiều rộng (cm)"
    productWidth: Float
    "Chiều cao (cm)"
    productHeight: Float
    "Có cho xem hàng"
    isPackageViewable: Boolean
    "Giao hàng thu tiền (COD)"
    hasMoneyCollection: Boolean
    "Khai giá"
    showOrderAmount: Boolean
    "Báo phát"
    hasReport: Boolean
    "Dịch vụ hóa đơn"
    hasInvoice: Boolean
    "Thu cước người nhận"
    hasReceiverPayFreight: Boolean
  }

  input DeliveryInfoInput {
    "Có cho xem hàng"
    isPackageViewable: Boolean
    "Giao hàng thu tiền (COD)"
    hasMoneyCollection: Boolean!
    "Khai giá"
    showOrderAmount: Boolean
    "Báo phát"
    hasReport: Boolean
    "Dịch vụ hóa đơn"
    hasInvoice: Boolean
    "Thu cước người nhận"
    hasReceiverPayFreight: Boolean
    "Ghi chú"
    note: String
    "Mã Dịch vụ giao hàng ${OfflineServices.map(s=>`${s.code}-${s.name}`).join('|')}"
    serviceId: String!
    "Mã kho giao hàng"
    addressStorehouseId: ID!
    "Nội dung hàng hóa"
    productName: String!
    "Trọng lượng (gr)"
    productWeight: Float!
    "Chiều dài (cm)"
    productLength: Float!
    "Chiều rộng (cm)"
    productWidth: Float!
    "Chiều cao (cm)"
    productHeight: Float!
  }
`;
