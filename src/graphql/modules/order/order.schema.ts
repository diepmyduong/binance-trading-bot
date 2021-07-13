import { gql } from "apollo-server-express";
import { OrderStatus, PaymentMethod, PickupMethod, ShipMethod } from "./order.model";

const schema = gql`
  extend type Query {
    #order thường
    getAllOrder(q: QueryGetListInput): OrderPageData
    #order chuyển
    getTransferedOrders(q: QueryGetListInput): OrderPageData

    getOneOrder(id: ID!): Order
    getAllDeliveryMethod: [DeliveryMethod]
    getAllPaymentMethod: [PaymentMethod]
    getAllShipService(shipMethod:String!):[ShipServicePricing]
  }

  extend type Mutation {
    createOrder(data: CreateOrderInput!): [Order]
    cancelOrder(id: ID!, note: String): Order
    deliveryOrder(orderId: ID!, deliveryInfo:DeliveryInfoInput!): Order
    confirmToMemberOrder(id: ID!, note: String): Order
    approveToMemberOrder(id: ID!, note: String, status: String): Order
    
  }

  type PaymentMethod{
    value: String
    label: String
  }

  type DeliveryMethod {
    value: String
    label: String
  }

  input CreateOrderInput {
    items: [OrderItemInput]!
    buyerName: String!
    buyerPhone: String!
    buyerAddress: String
    buyerProvinceId: String
    buyerDistrictId: String
    buyerWardId: String
    shipMethod: String!
    paymentMethod: String!
    addressDeliveryId: ID
    note: String
    latitude: Float
    longitude: Float
  }
  
  

  type Order {
    id: String
    createdAt: DateTime
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
    "Tổng tiền topping"
    toppingAmount: Float
    "Phương thức vận chuyển ${Object.values(ShipMethod)}"
    shipMethod: String
    "Tiền ship"
    shipfee: Float
    "Khoản cách ship"
    shipDistance: Float
    "Phương thức thanh toán ${Object.values(PaymentMethod)}"
    paymentMethod: String
    "Ghi chú đơn hàng"
    note: String
    "Số lượng sản phẩm"
    itemCount: Int
    "Chủ shop bán"
    sellerId: ID 
    "Mã chủ shop bán"
    sellerCode: String
    "Chủ shop bán"
    sellerName: String
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
    "Địa chỉ đầy đủ"
    buyerFullAddress: String
    "Ghi chú địa chỉ"
    buyerAddressNote: String
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
    updatedByUserId: ID
    
    orderType: String
    orderTypeText: String

    "Phương thức nhận hàng ${Object.values(PickupMethod)}"
    pickupMethod: String
    "Thời gian nhận hàng"
    pickupTime: DateTime
    "Mã chi nhánh"
    shopBranchId: String
    shopBranch: ShopBranch
    "Lý do huỷ"
    cancelReason: String
    "Ghim đơn"
    pin: Boolean

    "Mã voucher"
    voucherId: ID
    voucher: ShopVoucher
    "Giảm giá"
    discount: Float
    "Chi tiết giảm giá"
    discountDetail: String
  }


  type OrderPageData {
    data: [Order]
    total: Int
    pagination: Pagination
  }
`;

export default schema;
