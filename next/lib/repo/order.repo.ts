import { ShopBranch } from "./shop-branch.repo";
import { PaymentMethod } from "./../../../src/graphql/modules/order/order.model";
import { String } from "lodash";
import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { Member } from "./member.repo";
import { Product } from "./product.repo";
import { User } from "./user.repo";

export interface OrderInput {
  buyerName: string;
  buyerPhone: string;
  pickupMethod: "DELIVERY" | "STORE";
  shopBranchId: string;
  pickupTime: string;
  buyerAddress: string;
  buyerProvinceId: string;
  buyerDistrictId: string;
  buyerWardId: string;
  latitude: number;
  longitude: number;
  paymentMethod: string;
  note: string;
  items?: OrderItemInput[];
}

export interface CreateOrderInput {
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerProvinceId: string;
  buyerDistrictId: string;
  buyerWardId: string;
  shipMethod: string;
  latitude: number;
  longitude: number;
  paymentMethod: string;
  note: string;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  note?: string;
  toppings: OrderItemToppingInput[];
}
export interface OrderItemToppingInput {
  toppingId: string;
  toppingName: string;
  optionName: string;
  price: number;
}

export interface Order extends BaseModel {
  code: string;
  cancelReason: string;
  isPrimary: boolean;
  itemIds: string[];
  amount: number;
  subtotal: number;
  toppingAmount: number;
  shipMethod: string;
  shipfee: number;
  shipDistance: number;
  paymentMethod: string;
  note: string;
  itemCount: number;
  sellerId: string;
  sellerCode: string;
  sellerName: string;
  fromMemberId: string;
  status: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerProvince: string;
  buyerDistrict: string;
  buyerWard: string;
  buyerProvinceId: string;
  buyerDistrictId: string;
  buyerWardId: string;
  sellerBonusPoint: number;
  buyerBonusPoint: number;
  addressStorehouseId: string;
  addressDeliveryId: string;
  paymentMethodText: string;
  shipMethodText: string;
  statusText: string;
  collaboratorId: string;
  isUrbanDelivery: boolean;
  toMemberId: string;
  toMemberNote: string;
  mustTransfer: boolean;
  latitude: number;
  longitude: number;
  items: OrderItem[];
  seller: Member;
  fromMember: Member;
  updatedByUser: User;
  buyer: Customer;
  deliveringMember: Member;
  toMember: Member;
  updatedByUserId: string;
  orderType: string;
  orderTypeText: string;
  pickupMethod: "DELIVERY" | "STORE";
  pickupTime: string;
  shopBranchId: string;
  deliveryInfo: DeliveryInfo;
  logs: OrderLog[];
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  shopBranch: ShopBranch;
}
export interface OrderItem extends BaseModel {
  orderId: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  productName: string;
  basePrice: number;
  qty: number;
  amount: number;
  product: Product;
  toppings: OrderItemTopping[];
}
export interface OrderItemTopping extends BaseModel {
  toppingId: string;
  toppingName: string;
  optionName: string;
  price: number;
}
interface OrderLog {}
interface DeliveryInfo {
  senderFullname: string;
  senderTel: string;
  senderAddress: string;
  senderWardId: string;
  senderProvinceId: string;
  senderDistrictId: string;
  receiverFullname: string;
  receiverAddress: string;
  receiverTel: string;
  receiverProvinceId: string;
  receiverDistrictId: string;
  receiverWardId: string;
  receiverAddressType: number;
  serviceName: string;
  serviceIcon: string;
  orderCode: string;
  packageContent: string;
  weightEvaluation: number;
  widthEvaluation: number;
  lengthEvaluation: number;
  heightEvaluation: number;
  codAmountEvaluation: number;
  isPackageViewable: boolean;
  pickupType: number;
  orderAmountEvaluation: number;
  isReceiverPayFreight: boolean;
  customerNote: string;
  useBaoPhat: boolean;
  useHoaDon: boolean;
  customerCode: string;
  vendorId: string;
  itemCode: string;
  orderId: string;
  createTime: string;
  lastUpdateTime: string;
  deliveryDateEvaluation: string;
  cancelTime: string;
  deliveryTime: string;
  deliveryTimes: number;
  status: string;
  statusText: string;
  partnerFee: number;
}
export class OrderRepository extends CrudRepository<Order> {
  apiName: string = "Order";
  displayName: string = "đơn hàng";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    itemIds: [ID]
    amount: Float
    subtotal: Float
    toppingAmount: Float
    shipMethod: String
    shipfee: Float
    shipDistance: Float
    paymentMethod: String
    note: String
    itemCount: Int
    status: String
    buyerId: ID
    buyerName: String
    buyerPhone: String
    buyerAddress: String
    buyerProvince: String
    buyerDistrict: String
    buyerWard: String
    buyerProvinceId: String
    buyerDistrictId: String
    buyerWardId: String
    paymentMethodText: String
    shipMethodText: String
    statusText: String
    fromMember {
      id: String
      name: String
      phone: String
      address: String
    }: Member
    updatedByUser {
      id: String
      name: String
    }: User
    buyer {
      id: String
      name: String
    }: Customer
    deliveringMember{
      id: String
      name: String
    }: Member
    shopBranch{
        name:String
        code:String
        address:String
      }:ShopBranch
    seller{
      shopName:string
    }:Member
    orderType: String
    orderTypeText: String
    pickupMethod: String
    pickupTime: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    code: String
    itemIds: [ID]
    amount: Float
    subtotal: Float
    toppingAmount: Float
    shipMethod: String
    shipfee: Float
    shipDistance: Float
    paymentMethod: String
    note: String
    cancelReason: String
    itemCount: Int
    sellerId: ID
    sellerCode: String
    sellerName: String
    status: String
    buyerId: ID
    buyerName: String
    buyerPhone: String
    buyerAddress: String
    buyerProvince: String
    buyerDistrict: String
    buyerWard: String
    buyerProvinceId: String
    buyerDistrictId: String
    buyerWardId: String
    paymentMethodText: String
    shipMethodText: String
    statusText: String
    isUrbanDelivery: Boolean
    latitude: Float
    longitude: Float
    items {
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      orderId: ID
      sellerId: ID
      buyerId: ID
      note:String
      isPrimary: Boolean
      productId: ID
      productName: String
      basePrice: Float
      qty: Int
      amount: Float
      product {
        id: String
        image: String
      }: Product
      toppings {
        toppingId: ID
        toppingName: String
        optionName: String
        price: Float
      }: [OrderItemTopping]
    }: [OrderItem]
    seller {
      id: String
      name: String
      address: String
    }: Member
    fromMember {
      id: String
      name: String
      phone: String
    }: Member
    updatedByUser {
      id: String
      name: String
    }: User
    buyer {
      id: String
      name: String
    }: Customer
    deliveringMember{
      id: String
      name: String
    }: Member
    toMember {
      id: String
      name: String
    }: Member
    deliveryInfo {
      senderFullname: String
      senderTel: String
      senderAddress: String
      senderWardId: String
      senderWardId: String
      senderProvinceId: String
      senderDistrictId: String
      receiverFullname: String
      receiverAddress: String
      receiverTel: String
      receiverProvinceId: String
      receiverDistrictId: String
      receiverWardId: String
      receiverAddressType: Int
      serviceName: String
      serviceIcon: String
      orderCode: String
      packageContent: String
      weightEvaluation: Int
      widthEvaluation: Int
      lengthEvaluation: Int
      heightEvaluation: Int
      codAmountEvaluation: Float
      isPackageViewable: Boolean
      pickupType: Int
      orderAmountEvaluation: Float
      isReceiverPayFreight: Boolean
      customerNote: String
      useBaoPhat: Boolean
      useHoaDon: Boolean
      customerCode: String
      vendorId: String
      itemCode: String
      orderId: String
      createTime: String
      lastUpdateTime: String
      deliveryDateEvaluation: String
      cancelTime: String
      deliveryTime: String
      deliveryTimes: Int
      status: String
      statusText: String
      partnerFee: Float
    }: DeliveryInfo
    updatedByUserId: ID
    orderType: String
    orderTypeText: String
    pickupMethod: String
    pickupTime: DateTime
    shopBranchId: String
    driverId: ID
    driverName: String
    driverPhone: String
    driverLicense: String
  `);

  async generateDraftOrder(data: OrderInput): Promise<any> {
    return await this.mutate({
      mutation: `generateDraftOrder(data: $data) {
          order{
            ${this.shortFragment}
          }
          invalid
          invalidReason
        }`,
      variablesParams: `($data:CreateDraftOrderInput!)`,
      options: { variables: { data } },
    }).then((res) => {
      return res.data["g0"];
    });
  }
  async generateOrder(data: OrderInput): Promise<Order> {
    return await this.mutate({
      mutation: `generateOrder(data: $data) {
        id
        code
        seller { id shopName }
        buyerName buyerPhone
        buyerAddress buyerProvince buyerDistrict buyerWard
        pickupMethod
        subtotal
        toppingAmount
        shipfee
        amount
        status
      }`,
      variablesParams: `($data:CreateDraftOrderInput!)`,
      options: { variables: { data } },
    }).then((res) => {
      return res.data["g0"];
    });
  }
  async cancelOrder(id: string, note: string): Promise<Order> {
    return await this.mutate({
      mutation: `cancelOrder(id: "${id}", note: "${note}") {
        ${this.fullFragment}
      }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }
}
export const OrderService = new OrderRepository();

export const ORDER_STATUS: Option[] = [
  { value: "PENDING", label: "Chờ duyệt", color: "warning" },
  { value: "CONFIRMED", label: "Làm món", color: "info" },
  { value: "DELIVERING", label: "Đang giao", color: "purple" },
  { value: "COMPLETED", label: "Hoàn thành", color: "success" },
  { value: "FAILURE", label: "Thất bại", color: "danger" },
  { value: "CANCELED", label: "Đã huỷ", color: "bluegray" },
  { value: "RETURNED", label: "Đã hoàn hàng", color: "orange" },
  { value: "UNCOMPLETED", label: "Chưa hoàn thành", color: "teal" },
];

export const PICKUP_METHODS: Option[] = [
  { value: "DELIVERY", label: "Giao hàng" },
  { value: "STORE", label: "Lấy tại cửa hàng" },
];

export const PAYMENT_METHODS: Option[] = [
  { value: "COD", label: "Nhận tiền khi giao hàng" },
  { value: "MOMO", label: "Ví điện tử MoMo" },
  { value: "VNPAY", label: "Cổng thanh toán VNPAY" },
];
