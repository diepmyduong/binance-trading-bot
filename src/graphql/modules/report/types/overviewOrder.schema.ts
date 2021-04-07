import { gql } from "apollo-server-express";
import { OrderStatus, PaymentMethod, ShipMethod } from "../../order/order.model";

const schema = gql`
  extend type Query {
    getOrderReports(q: QueryGetListInput): OverviewOrderPageData 
    getOrderReportsOverview(fromDate: String, toDate: String, sellerIds: [ID], isLate: Boolean): OverviewOrdersReport 
    # Add Query
  }

  type OrderStats{
    count: Int
    sum: Float
  }

  type OverviewOrdersReport {
    allOrders: OrderStats
    pendingOrders: OrderStats
    confirmedOrders: OrderStats
    deliveringOrders: OrderStats
    completedOrders: OrderStats
    failureOrders: OrderStats
    canceledOrders: OrderStats
  }

  type OverviewOrder {
    id: String
    updatedAt: DateTime
    
    "Mã đơn hàng"
    code: String 
    "Đơn Mobifone"
    isPrimary: Boolean 
    "Danh sách sản phẩm"
    itemIds: [ID]
    "Thành tiền"
    amount: Float 
    "Tổng tiền hàng"
    subtotal: Float
    "Phương thức vận chuyển ${Object.values(ShipMethod)}"
    shipMethod: String
    "Tiền ship"
    shipfee: Float
    "Phương thức thanh toán ${Object.values(PaymentMethod)}"
    paymentMethod: String
    "Ghi chú đơn hàng"
    note: String
    "Số lượng sản phẩm"
    itemCount: Int
    "Chủ shop bán"
    sellerId: ID 
    "Chủ shop bán chéo"
    fromMemberId: ID
    "Trạng thái ${Object.values(OrderStatus).join('|')}"
    status: String
    "Hoa hồng VNPOST"
    commission0: Float
    "Hoa hồng điểm bán"
    commission1: Float
    "Hoa hồng giới thiệu"
    commission2: Float
    "Hoa hồng kho"
    commission3: Float
    "Khách hàng mua"
    buyerId: ID 
    "Tên khách hàng"
    buyerName: String 
    "Điện thoại khách hàng"
    buyerPhone: String 
    "Địa chỉ khách hàng"
    buyerAddress: String 
    "Tỉnh / thành"
    buyerProvince: String 
    "Quận / huyện"
    buyerDistrict: String 
    "Phường / xã"
    buyerWard: String 
    "Mã Tỉnh / thành"
    buyerProvinceId: String 
    "Mã Quận / huyện"
    buyerDistrictId: String 
    "Mã Phường / xã"
    buyerWardId: String 
    "Điểm thường người bán"
    sellerBonusPoint: Float
    "Điểm thưởng người mua"
    buyerBonusPoint: Float
    "Địa điểm nhận hàng"
    addressStorehouseId: ID
    "Địa điểm nhận hàng"
    addressDeliveryId: ID

    paymentMethodText: String
    shipMethodText: String
    statusText: String
    "Mã Cộng tác viên"
    collaboratorId: ID
    "Là nội thành"
    isUrbanDelivery: Boolean
    "Bưu cục được chuyển đơn"
    toMemberId: ID
    "Ghi chú chuyển đơn"
    toMemberNote: String

    "Có chuyển kho không ?"
    mustTransfer: Boolean

    latitude: Float
    longitude: Float
    items: [OrderItem]
    orderLogIds: [ID]
    orderLogs: [OrderLog]

    seller: Member
    fromMember: Member
    updatedByUser: User
    buyer: Customer
    deliveringMember: Member
    toMember: Member
    addressStorehouse: AddressStorehouse
    addressDelivery: AddressDelivery
    "Cộng tác viên"
    collaborator: CustomerCollaborator
    "Thông tin vận đơn"
    deliveryInfo: DeliveryInfo

    "Đơn trễ"
    isLate: Boolean

    "Ngày tạo đơn"
    createdAt: DateTime
    "Ngày chốt đơn"
    finishedAt: DateTime

    "Hoa hồng"
    commission: Float
  }

  type OverviewOrderPageData {
    data: [OverviewOrder]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;