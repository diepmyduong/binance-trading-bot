import { BaseModel, CrudRepository } from "./crud.repo";

export interface OrderInput {
  buyerName: string;
  buyerPhone: string;
  pickupMethod: string;
  shopBranchId: string;
  pickupTime: string;
  buyerProvinceId: string;
  buyerDistrictId: String;
  buyerWardId: string;
  latitude: number;
  longtitude: number;
  paymentMethod: string;
  note: string;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  toppings: OrderItemToppingInput[];
}
export interface OrderItemToppingInput {
  toppingId: string;
  toppingName: string;
  optionName: string;
  price: number;
}

export interface Order {}
export class OrderRepository extends CrudRepository<Order> {
  apiName: string = "Order";
  displayName: string = "đơn hàng";
  shortFragment: string = this.parseFragment(`
    id: String 
    createdAt: String 
    updatedAt: String 
    code: String 
    isPrimary: Boolean 
    itemsIds: [String] 
    amount: Float 
    subtotal: Float 
    toppingAmount: Float 
    shipMethod: String 
    shipfee: Float 
    paymentMethod: String 
    note: String
    itemCount: Int 
    sellerId: String 
    sellerCode: String 
    sellerName: String 
    fromMemberId: String 
    status: String 
    commission0: Float 
    commission1: Float 
    commission2: Float 
    commission3: Float 
    buyerId: String 
    buyerName: String 
    buyerPhone: String 
    buyerAdress: String 
    buyerProvince: String
    buyerDistrict: String 
    buyerWard: String 
    buyerProvinceId: String 
    buyerDistrictId: String 
    buyerWardId: String 
    sellerBonusPoint: Float 
    buyerBonusPoint: Float 
    addressStorehouseId: String 
    addressDeliveryId: String 
    paymentMethodText: String 
    shipMethodText: String
    statusText: String 
    collaboratorId: String 
    isUrbanDelivery: String 
    toMemberId: String 
    toMemberNote: String 
    mustTransfer: String 
    latitude: Float 
    longtitude: Float 
    items: [OrderItem] 
    seller: Member 
    fromMember: Member 
    updateByUser: User 
    buyer: Customer 
    deliveringMember: Member 
    toMember: Member 
    addressStorehouse: AddressStorehouse 
    collaborator: Collaborator 
    deliveryInfo: DeliveryInfo 
    updatedByUserId: String 
    orderType: String 
    orderTypeText: String 
    pickupTime: DateTime 
    shopBranchId: String 
    commissionLogs: [CommissionLog]
    customerCommissionLogs: [CustomerCommissionLogs]
    logs: [OrderLog]
    driverId: String 
    driverName: String 
    driverPhone: String 
    driverLicense: String
  `);
  fullFragment: string = this.parseFragment(`
  id: String 
    createdAt: String 
    updatedAt: String 
    code: String 
    isPrimary: Boolean 
    itemsIds: [String] 
    amount: Float 
    subtotal: Float 
    toppingAmount: Float 
    shipMethod: String 
    shipfee: Float 
    paymentMethod: String 
    note: String
    itemCount: Int 
    sellerId: String 
    sellerCode: String 
    sellerName: String 
    fromMemberId: String 
    status: String 
    commission0: Float 
    commission1: Float 
    commission2: Float 
    commission3: Float 
    buyerId: String 
    buyerName: String 
    buyerPhone: String 
    buyerAdress: String 
    buyerProvince: String
    buyerDistrict: String 
    buyerWard: String 
    buyerProvinceId: String 
    buyerDistrictId: String 
    buyerWardId: String 
    sellerBonusPoint: Float 
    buyerBonusPoint: Float 
    addressStorehouseId: String 
    addressDeliveryId: String 
    paymentMethodText: String 
    shipMethodText: String
    statusText: String 
    collaboratorId: String 
    isUrbanDelivery: String 
    toMemberId: String 
    toMemberNote: String 
    mustTransfer: String 
    latitude: Float 
    longtitude: Float 
    items: [OrderItem] 
    seller: Member 
    fromMember: Member 
    updateByUser: User 
    buyer: Customer 
    deliveringMember: Member 
    toMember: Member 
    addressStorehouse: AddressStorehouse 
    collaborator: Collaborator 
    deliveryInfo: DeliveryInfo 
    updatedByUserId: String 
    orderType: String 
    orderTypeText: String 
    pickupTime: DateTime 
    shopBranchId: String 
    commissionLogs: [CommissionLog]
    customerCommissionLogs: [CustomerCommissionLogs]
    logs: [OrderLog]
    driverId: String 
    driverName: String 
    driverPhone: String 
    driverLicense: String
  `);

  async generateOrder(data: OrderInput): Promise<Order> {
    return await this.mutate({
      mutation: `generateDraftOrder(data: $data) {
          order{
            id
          }
        }`,
      variablesParams: `($data:CreateDraftOrderInput!)`,
      options: { variables: { data } },
    }).then((res) => {
      return res.data["g0"];
    });
  }
}

export const OrderService = new OrderRepository();
