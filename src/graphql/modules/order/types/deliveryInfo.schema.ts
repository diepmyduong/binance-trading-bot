import { gql } from "apollo-server-express";

export default gql`
  type DeliveryInfo {
    "Ngày giao hàng"
    date: DateTime
    "Kho giao hàng"
    storeId: ID
    "Mã Dịch vụ giao hàng"
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
    "Tên gói hàng"
    productName: String
    "Mô tả gói hàng"
    productDesc: String
    "Cân nặng"
    productWeight: Float
    "Chiều dài"
    productLength: Float
    "Chiều rộng"
    productWidth: Float
    "Chiều cao"
    productHeight: Float
    "Phương thức thu tiền"
    orderPayment: Int
  }
  input DeliveryInfoInput {
    "Kho giao hàng"
    storeId: ID
    "Ngày giao hàng"
    date: DateTime
    "Dịch vụ giao hàng"
    serviceId: String
    "Ghi chú giao hàng"
    note: String
    "Tiền thu hộ"
    moneyCollection: Float
    "Tên gói hàng"
    productName: String
    "Mô tả gói hàng"
    productDesc: String
    "Cân nặng"
    productWeight: Float
    "Chiều dài"
    productLength: Float
    "Chiều rộng"
    productWidth: Float
    "Chiều cao"
    productHeight: Float
    "Phương thức thu tiền"
    orderPayment: Int
    "Voucher giao hàng"
    orderVoucher: String
  }
`;
