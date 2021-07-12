import { gql } from "apollo-server-express";
import { OrderStatus, PaymentMethod, ShipMethod } from "../../order/order.model";

const schema = gql`
  extend type Query {
    getCommissionReports(q: QueryGetListInput): OverviewCommissionPageData 
    getCommissionReportsOverview(fromDate: String, toDate: String, sellerIds: [ID], branchId: ID, collaboratorId: ID, orderStatus: String): OverviewCommissionReport 
    # Add Query
  }

  type OverviewCommissionReport {
    "Đơn hoàn thành"
    completeOrder: Int
    "Đơn chưa hoàn thành"
    uncompleteOrder: Int
    "Tổng hoa hồng thực nhận"
    totalCommission: Float
    "Tổng hoa hồng dự kiến"
    totalUnCompletedCommission: Float

    "Hoa hồng điểm bán"
    commission1:Float
    "Hoa hồng giới thiệu"
    commission2:Float
    "Hoa hồng CTV"
    commission21:Float
    "Hoa hồng giao hàng"
    commission3:Float

    "Hoa hồng cửa hàng dự kiến"
    unCompletedCommission1:Float
    "Hoa hồng điểm bán dự kiến"
    unCompletedcommission2:Float
    "Hoa hồng CTV dự kiến"
    unCompletedcommission21:Float
    "Hoa hồng giao hàng dự kiến"
    unCompletedcommission3:Float
  }

  type CommissionDetail{
    "Mã"
    code: String,
    "Tên"
    name: String,
    "Loại"
    type: String,
    "Hoa hồng"
    value: Float
  }

  type OverviewCommission {
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
    "Trạng thái ${Object.values(OrderStatus).join("|")}"
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
    "Cửa hàng được chuyển đơn"
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
    collaborator: Collaborator
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
    "Chi tiết hoa hồng điểm bán"
    commission1Details: CommissionDetail
    "Chi tiết hoa hồng CTV"
    commission2Details: CommissionDetail
    "Chi tiết hoa hồng giao hàng"
    commission3Details: CommissionDetail
  }

  type OverviewCommissionPageData {
    data: [OverviewCommission]
    total: Int
    pagination: Pagination
  }
  
`;

export default schema;
