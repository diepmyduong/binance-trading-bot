import { gql } from "apollo-server-express";
import { OrderStatus, PaymentMethod, ShipMethod } from "./order.model";

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
    generateDraftOrder(data: CreateDraftOrderInput!): DraftOrderData
    transferOrder(id:ID!, memberId: ID!, note: String): Order
    generateDraftDeliveryOrder(data: CreateDraftDeliveryOrderInput!): DraftDeliveryOrderData

    cancelOrder(id: ID!, note: String): Order

    #VNPOST
    deliveryOrder(orderId: ID!, deliveryInfo:DeliveryInfoInput!): Order
    #A => A
    confirmOrder(id: ID!, note: String): Order
    deliveryMemberOrder(id: ID!): Order
    approveOrder(id: ID!, note: String , status: String): Order

    #A => B
    confirmToMemberOrder(id: ID!, note: String): Order
    deliveryToMemberOrder (id: ID!): Order
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

  type DraftDeliveryOrderData {
    order: Order,
    invalid: Boolean,
    invalidReason: String
  }

  input CreateDraftDeliveryOrderInput {
    items: [OrderItemInput]!
    buyerName: String
    buyerPhone: String
    buyerAddress: String
    buyerProvinceId: String
    buyerDistrictId: String
    buyerWardId: String
    shipMethod: String!
    paymentMethod: String!
    addressDeliveryId: ID
    latitude: Float
    longitude: Float
  }

  type DraftOrderData {
    orders: [Order],
    allOrder: Order,
    invalid: Boolean,
    invalidReason: String
  }


  input CreateDraftOrderInput {
    items: [OrderItemInput]!
    buyerName: String
    buyerPhone: String
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
  
  input OrderItemInput {
    productId: ID!
    quantity: Int!
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
    "Người cập nhật"
    updatedByUserId: ID 
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

    items: [OrderItem]
    seller: Member
    fromMember: Member
    updatedByUser: User
    buyer: Customer

    paymentMethodText: String
    shipMethodText: String
    statusText: String
    "Thông tin vận đơn"
    deliveryInfo: DeliveryInfo
    "Mã Cộng tác viên"
    collaboratorId: ID
    "Cộng tác viên"
    collaborator: Collaborator
    "Là nội thành"
    isUrbanDelivery: Boolean
    "Bưu cục được chuyển đơn"
    toMemberId: ID
    "Ghi chú chuyển đơn"
    toMemberNote: String
    addressStorehouse: AddressStorehouse
    addressDelivery: AddressDelivery

    latitude: Float
    longitude: Float
    
    deliveringMember: Member
    toMember: Member
  }

  type OrderPageData {
    data: [Order]
    total: Int
    pagination: Pagination
  }
`;

export default schema;