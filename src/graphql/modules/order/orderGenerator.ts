import { Dictionary, get, groupBy, keyBy, maxBy, sumBy } from "lodash";
import { Types } from "mongoose";

import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { onOrderedProduct } from "../../../events/onOrderedProduct.event";
import { VietnamPostHelper } from "../../../helpers";
import {
  ICalculateAllShipFeeRequest,
  PickupType,
} from "../../../helpers/vietnamPost/resources/type";
import { addressService } from "../address/address.service";
import { AddressDeliveryModel } from "../addressDelivery/addressDelivery.model";
import {
  AddressStorehouseModel,
  IAddressStorehouse,
} from "../addressStorehouse/addressStorehouse.model";
import { CampaignModel } from "../campaign/campaign.model";
import { CampaignSocialResultModel } from "../campaignSocialResult/campaignSocialResult.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { ICustomer } from "../customer/customer.model";
import { IMember, MemberModel } from "../member/member.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import { IProduct, ProductModel } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { OrderHelper } from "./order.helper";
import {
  IOrder,
  OrderModel,
  OrderStatus,
  OrderType,
  PaymentMethod,
  ShipMethod,
} from "./order.model";

type OrderItemInput = {
  productId: string;
  quantity: number;
};
export type CreateOrderInput = {
  isPrimary: boolean;
  items: OrderItemInput[];
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerProvinceId: string;
  buyerDistrictId: string;
  buyerWardId: string;
  shipMethod: string;
  paymentMethod: string;
  addressDeliveryId: string;
  note: string;
  latitude: number;
  longitude: number;
};
export class OrderGenerator {
  order: IOrder;
  orderItems: IOrderItem[] = [];
  products: Dictionary<IProduct>;
  unitPrice: number;
  constructor(
    public orderInput: CreateOrderInput,
    public seller: IMember,
    public buyer: ICustomer,
    public collaboratorId?: string,
    public campaignCode?: string
  ) {
    this.order = new OrderModel({
      code: "",
      isPrimary: orderInput.isPrimary,
      isCrossSale: !orderInput.isPrimary,
      itemIds: [],
      amount: 0,
      subtotal: 0,
      itemCount: 0,
      status: OrderStatus.PENDING,
      commission1: 0,
      commission2: 0,
      commission3: 0,
      buyerId: buyer._id,
      buyerName: orderInput.buyerName,
      buyerPhone: orderInput.buyerPhone,
      buyerAddress: orderInput.buyerAddress,
      buyerProvince: orderInput.buyerProvinceId,
      buyerDistrict: orderInput.buyerDistrictId,
      buyerWard: orderInput.buyerWardId,
      buyerProvinceId: orderInput.buyerProvinceId,
      buyerDistrictId: orderInput.buyerDistrictId,
      buyerWardId: orderInput.buyerWardId,
      sellerBonusPoint: 0,
      buyerBonusPoint: 0,
      // delivery
      itemWeight: 0,
      itemWidth: 0, // chiều rộng
      itemLength: 0, // chiều dài
      itemHeight: 0, // chiều cao
      shipfee: 0,
      // deliveryInfo: {},
      shipMethod: orderInput.shipMethod,
      paymentMethod: orderInput.paymentMethod,
      productIds: [],
      addressDeliveryId: orderInput.addressDeliveryId,
      note: orderInput.note,
      longitude: orderInput.longitude,
      latitude: orderInput.latitude,
      orderLogIds: [],
      orderType: orderInput.isPrimary ? OrderType.POST : OrderType.CROSSSALE,
    });
  }
  async generate() {
    await this.getUnitPrice();
    await Promise.all([this.setOrderItems(), this.setBuyerAddress()]);
    this.calculateAmount(); // Tính tiền trước phí ship
    await this.setOrderSeller();
    await this.setCollaborator();
    await Promise.all([this.setCampaign(), this.calculateShipfee()]);
    this.calculateAmount(); // Tính tiền sau phí ship
  }
  private async setOrderSeller() {
    this.order.fromMemberId = this.seller._id;
    if (!this.orderInput.isPrimary) {
      const sellerIds = Object.keys(groupBy(Object.values(this.products), "memberId"));
      if (sellerIds.length > 1) throw Error("Sản phẩm không cùng 1 cửa hàng");
      this.seller = await MemberModel.findById(sellerIds[0]);
    }
    this.order.sellerId = this.seller._id;
    this.order.sellerCode = this.seller.code;
    this.order.sellerName = this.seller.shopName || this.seller.name;
  }

  toDraft() {
    const order = this.order;
    order.items = this.orderItems;
    return order;
  }
  async toOrder() {
    this.order.code = await OrderHelper.generateCode();
    const order = await this.order.save();
    await OrderItemModel.insertMany(this.orderItems);
    onOrderedProduct.next(order);
    return order;
  }
  private async setCampaign() {
    if (!this.campaignCode) return;
    const campaign = await CampaignModel.findOne({ code: this.campaignCode });
    if (!campaign) return;
    const campaignSocialResults = await CampaignSocialResultModel.find({
      memberId: this.order.fromMemberId,
      campaignId: campaign.id,
    }).then((res) => keyBy(res, "productId"));
    this.orderItems = this.orderItems.map((item: IOrderItem) => {
      const campaignRes = campaignSocialResults[item.productId];
      if (campaignRes) {
        item.campaignId = campaign._id;
        item.campaignSocialResultId = campaignRes._id;
      }
      return item;
    });
  }
  private async calculateAmount() {
    this.order.amount = this.order.subtotal + this.order.shipfee;
  }
  private async calculateShipfee() {
    switch (this.order.shipMethod) {
      case ShipMethod.NONE:
        this.order.shipfee = await SettingHelper.load(SettingKey.DELIVERY_ORDER_SHIP_FEE);
        return;
      case ShipMethod.POST:
        return await this.calculatePostShipFee();
      case ShipMethod.VNPOST:
        return await this.calculateVNPostShipFee();
      default:
        throw new Error("Phương thức vận chuyển chưa được hỗ trợ.");
    }
  }
  private async calculatePostShipFee() {
    const storehouses = await AddressStorehouseModel.find({
      _id: { $in: this.seller.addressStorehouseIds },
      activated: true,
    });
    if (storehouses.length === 0) throw new Error("Chưa cấu hình chi nhánh kho");
    if (!this.order.addressDeliveryId) throw new Error("Chưa chọn địa điểm nhận hàng");
    const addressDeliveryNotExists =
      this.seller.addressDeliveryIds.findIndex(
        (id: any) => id.toString() == this.order.addressDeliveryId.toString()
      ) === -1;
    if (addressDeliveryNotExists) throw new Error("Mã địa điểm nhận không đúng");

    const addressDelivery = await AddressDeliveryModel.findOne({
      _id: this.order.addressDeliveryId,
      activated: true,
    });

    if (!addressDelivery) {
      throw ErrorHelper.mgRecoredNotFound("Địa điểm nhận hàng");
    }
    this.order.shipfee = await SettingHelper.load(SettingKey.DELIVERY_POST_FEE);
  }
  private async calculateVNPostShipFee() {
    const [storehouses, addressStorehouse] = await Promise.all([
      AddressStorehouseModel.find({
        _id: { $in: this.seller.addressStorehouseIds },
        activated: true,
      }),
      this.getNearestStore(),
    ]);
    const mainAddressStorehouse = this.seller.mainAddressStorehouseId
      ? storehouses.find((s) => s._id.toString() == this.seller.mainAddressStorehouseId.toString())
      : null;
    const urbanStores = storehouses.filter(
      (store) => store.provinceId === this.order.buyerProvinceId
    );
    this.order.isUrbanDelivery = urbanStores.length > 0;
    const deliveryStorehouse = addressStorehouse || mainAddressStorehouse;

    const vnpostShipFee = await this.getAllVNPostShipFee(deliveryStorehouse);

    this.order.shipfee = vnpostShipFee.TongCuocBaoGomDVCT;
    this.order.addressStorehouseId = deliveryStorehouse._id;
    const codAmountEvaluation =
      this.order.paymentMethod == PaymentMethod.COD ? this.order.subtotal : 0;

    const deliveryInfo: any = {
      serviceName: vnpostShipFee.MaDichVu,
      codAmountEvaluation: codAmountEvaluation,
      deliveryDateEvaluation: vnpostShipFee.ThoiGianPhatDuKien,
      heightEvaluation: this.order.itemHeight,
      isReceiverPayFreight: false,
      lengthEvaluation: this.order.itemLength,
      weightEvaluation: this.order.itemWeight,
      widthEvaluation: this.order.itemWidth,
      packageContent: this.orderItems.map((i) => `[${i.productName} - SL:${i.qty}]`).join(" "),
      isPackageViewable: false,
      pickupType: PickupType.DROP_OFF,
      senderFullname: this.order.sellerName, // tên người gửi *
      senderTel: deliveryStorehouse.phone, // Số điện thoại người gửi * (maxlength: 50)
      senderAddress: deliveryStorehouse.address, // địa chỉ gửi *
      senderWardId: deliveryStorehouse.wardId, // mã phường người gửi *
      senderProvinceId: deliveryStorehouse.provinceId, // mã tỉnh người gửi *
      senderDistrictId: deliveryStorehouse.districtId, // mã quận người gửi *

      receiverFullname: this.order.buyerName, // tên người nhận *
      receiverAddress: this.order.buyerAddress, // địa chỉ nhận *
      receiverTel: this.order.buyerPhone, // phone người nhận *
      receiverProvinceId: this.order.buyerProvinceId, // mã tỉnh người nhận *
      receiverDistrictId: this.order.buyerDistrictId, // mã quận người nhận *
      receiverWardId: this.order.buyerWardId, // mã phường người nhận *
      partnerFee: this.order.shipfee,
    };
    this.order.deliveryInfo = deliveryInfo;
  }
  private async getAllVNPostShipFee(storehouse: IAddressStorehouse) {
    const defaultServiceCode = await SettingHelper.load(
      SettingKey.VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE
    );

    const data: ICalculateAllShipFeeRequest = {
      MaDichVu: defaultServiceCode,
      MaTinhGui: storehouse.provinceId,
      MaQuanGui: storehouse.districtId,
      MaTinhNhan: this.order.buyerProvinceId,
      MaQuanNhan: this.order.buyerDistrictId,
      Dai: this.order.itemLength,
      Rong: this.order.itemWidth,
      Cao: this.order.itemHeight,
      KhoiLuong: this.order.itemWeight,
      ThuCuocNguoiNhan: this.order.paymentMethod == PaymentMethod.COD,
      LstDichVuCongThem:
        this.order.paymentMethod == PaymentMethod.COD
          ? [
              {
                DichVuCongThemId: 3,
                TrongLuongQuyDoi: 0,
                SoTienTinhCuoc: this.order.subtotal.toString(),
              },
            ]
          : [],
    };
    const shopConfig = await ShopConfigModel.findOne({ memberId: this.seller._id });
    return await VietnamPostHelper.calculateAllShipFee(data, get(shopConfig, "vnpostToken"));
  }
  private async getNearestStore() {
    const longitude = this.order.longitude || 0;
    const latitude = this.order.latitude || 0;
    let query: any = {
      allowPickup: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
    };
    if (longitude == 0 || latitude == 0) {
      query = {
        allowPickup: true,
        wardId: this.order.buyerWardId,
        districtId: this.order.buyerDistrictId,
        provinceId: this.order.buyerProvinceId,
      };
    }
    return await AddressStorehouseModel.findOne(query).then((res) => {
      if (!res || res.districtId != this.order.buyerDistrictId) {
        return AddressStorehouseModel.findOne({
          _id: { $in: this.seller.addressStorehouseIds },
          allowPickup: true,
          districtId: this.order.buyerDistrictId,
        });
      }
      return res;
    });
  }
  private async setBuyerAddress() {
    return await Promise.all([
      addressService.setProvinceName(this.order, "buyerProvinceId", "buyerProvince"),
      addressService.setDistrictName(this.order, "buyerDistrictId", "buyerDistrict"),
      addressService.setWardName(this.order, "buyerWardId", "buyerWard"),
    ]);
  }
  private async setCollaborator() {
    let collaborator;
    if (this.collaboratorId) {
      collaborator = await CollaboratorModel.findById(this.collaboratorId);
    }
    if (!collaborator) {
      collaborator = await CollaboratorModel.findOne({
        phone: this.order.buyerPhone,
        memberId: this.order.fromMemberId,
      });
    }
    if (collaborator) this.order.collaboratorId = collaborator._id;
  }
  private async getUnitPrice() {
    this.unitPrice = this.unitPrice || (await SettingHelper.load(SettingKey.UNIT_PRICE));
    return this.unitPrice;
  }
  private async setOrderItems() {
    this.products = await this.getProductFromOrderInput(this.orderInput);
    this.orderItems = this.orderInput.items.map((i) => this.parseOrderItem(i));
    this.order.subtotal = sumBy(this.orderItems, "amount");
    this.order.itemCount = sumBy(this.orderItems, "qty");
    this.order.itemIds = this.orderItems.map((i) => i._id);
    this.order.commission0 = sumBy(this.orderItems, (i) => i.commission0 * i.qty);
    this.order.commission1 = sumBy(this.orderItems, (i) => i.commission1 * i.qty);
    this.order.commission2 = sumBy(this.orderItems, (i) => i.commission2 * i.qty);
    this.order.commission3 = sumBy(this.orderItems, (i) => i.commission3 * i.qty);
    this.order.sellerBonusPoint = sumBy(this.orderItems, "sellerBonusPoint");
    this.order.buyerBonusPoint = sumBy(this.orderItems, "buyerBonusPoint");
    this.order.itemHeight = maxBy(this.orderItems, "productHeight").productHeight;
    this.order.itemLength = maxBy(this.orderItems, "productLength").productLength;
    this.order.itemWidth = maxBy(this.orderItems, "productWidth").productWidth;
    this.order.itemWeight = sumBy(this.orderItems, (i) => i.productWeight * i.qty);
  }

  private async getProductFromOrderInput(orderInput: CreateOrderInput) {
    const productIds = orderInput.items.map((i) => i.productId).map(Types.ObjectId);
    const products = await ProductModel.find({ _id: { $in: productIds }, allowSale: true })
      .then((res) => res.filter((p) => (orderInput.isPrimary ? p.isPrimary : p.isCrossSale)))
      .then((res) => keyBy(res, "_id"));
    if (Object.values(products).length != orderInput.items.length) {
      throw Error("Không thể đặt hàng, sản phẩm không hợp lệ.");
    }
    return products;
  }

  private parseOrderItem(input: OrderItemInput) {
    const product = this.products[input.productId];
    const orderItem = new OrderItemModel({
      orderId: this.order._id,
      productId: product.id,
      productName: product.name,
      isPrimary: product.isPrimary,
      isCrossSale: product.isCrossSale,
      basePrice: product.basePrice,
      qty: input.quantity,
      amount: product.basePrice * input.quantity,
      productWeight: product.weight,
      productHeight: product.height,
      productLength: product.length,
      productWidth: product.width,
      commission0: 0,
      commission1: product.commission1,
      commission2: product.commission2,
      commission3: product.commission3,
      orderType: this.order.orderType,
    });
    // Điểm thưởng khách hàng
    if (product.enabledCustomerBonus)
      orderItem.buyerBonusPoint = getPointFromPrice(
        product.basePrice,
        this.unitPrice,
        product.customerBonusFactor
      );
    // Điểm thưởng chủ shop
    if (product.enabledMemberBonus)
      orderItem.sellerBonusPoint = getPointFromPrice(
        product.basePrice,
        this.unitPrice,
        product.memberBonusFactor
      );
    return orderItem;
  }
}

function getPointFromPrice(price: number, unitPrice: number, factor: number) {
  return Math.round((price / unitPrice) * factor);
}
