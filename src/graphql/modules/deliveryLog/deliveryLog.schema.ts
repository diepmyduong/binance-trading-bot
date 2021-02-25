import { gql } from "apollo-server-express";
import {  ShipMethods } from "../order/order.model";

const schema = gql`
  extend type Query {
    getAllDeliveryLog(q: QueryGetListInput): DeliveryLogPageData
    # Add Query
  }

  type DeliveryLog {
    id: String    
    createdAt: DateTime
    updatedAt: DateTime

    "Mã đơn hàng"
    orderId: ID
    "Mã chủ shop"
    memberId: ID
    "Mã khách hàng"
    customerId: ID
    "Mã vận đơn"
    deliveryId: String
    "Code vận đơn"
    deliveryCode: String
    "Mã vận đơn cũ"
    orderNumber: String
    "Phương thức vận chuyển"
    shipMethod: String
    "Trạng thái vận chuyển"
    status: String
    "Thông tin trạng thái vận chuyển"
    statusName: String
    "Thông tin vận chuyển chi tiết"
    statusDetail: String
    "Ngày cập nhật trạng thái"
    statusDate: DateTime
    "Ghi chú vận đơn"
    note: String
    "Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)"
    moneyCollection: Float
    "Phí thu hộ (Số tiền hàng cần thu hộ - không bao gồm tiền cước)"
    moneyFeeCOD: Float
    "Tổng tiền bao gồm VAT"
    moneyTotal: Float
    "Thời gian ước tính hoàn thiện"
    expectedDelivery: String
    "Trọng lượng sản phẩm"
    productWeight: Float
    "Dịch vụ giao hàng"
    orderService: String
    "Vị trí hiện tại"
    locationCurrently: String
    "Chi tiết"
    detail: String
  }

  type DeliveryLogPageData {
    data: [DeliveryLog]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
