import { chain, isNull, keyBy, set } from "lodash";
import {
  ErrorHelper,
  ICalculateAllShipFeeRequest,
  ICalculateAllShipFeeRespone,
  ServiceCode,
  VietnamPostHelper,
  PickupType,
} from "../../../helpers";
import { AddressModel } from "../address/address.model";
import { CounterModel } from "../counter/counter.model";
import {
  IProduct,
  ProductLoader,
  ProductModel,
  ProductType,
} from "../product/product.model";
import {
  IOrder,
  OrderModel,
  OrderType,
  PaymentMethod,
  ShipMethod,
} from "./order.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import {
  AddressStorehouseModel,
  IAddressStorehouse,
} from "../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../member/member.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { CampaignModel } from "../campaign/campaign.model";
import {
  CampaignSocialResultModel,
  ICampaignSocialResult,
} from "../campaignSocialResult/campaignSocialResult.model";
import { ObjectId, UnorderedBulkOperation } from "mongodb";
import { AddressDeliveryModel } from "../addressDelivery/addressDelivery.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { CustomerModel } from "../customer/customer.model";
import { DeliveryInfo } from "./types/deliveryInfo.type";
import { Types } from "mongoose";

export class OrderHelper {
  constructor(public order: IOrder) {}
  value() {
    return this.order;
  }
  static async generateCode() {
    const orderCounter = await CounterModel.findOneAndUpdate(
      { name: "order" },
      { $setOnInsert: { value: 100000 } },
      { upsert: true, new: true }
    );

    return orderCounter
      .updateOne({ $inc: { value: 1 } })
      .exec()
      .then((res) => {
        return "DH" + (orderCounter.value + 1);
      });
  }

  static validatePhone(phone: string) {
    if (!/^\d{9,10}$/g.test(phone)) {
      throw ErrorHelper.requestDataInvalid("Sai định dạng số điện thoại");
    }
    return this;
  }

  async setProvinceName() {
    if (!this.order.buyerProvinceId) return this;
    const address = await AddressModel.findOne({
      provinceId: this.order.buyerProvinceId,
    });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Tỉnh / thành");
    this.order.buyerProvince = address.province;
    return this;
  }
  async setDistrictName() {
    if (!this.order.buyerDistrictId) return this;
    const address = await AddressModel.findOne({
      districtId: this.order.buyerDistrictId,
    });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Quận / Huyện");
    this.order.buyerDistrict = address.district;
    return this;
  }
  async setWardName() {
    if (!this.order.buyerWardId) return this;
    const address = await AddressModel.findOne({
      wardId: this.order.buyerWardId,
    });
    if (!address) throw ErrorHelper.mgRecoredNotFound("Phường / Xã");
    this.order.buyerWard = address.ward;
    return this;
  }

  calculateAmount() {
    this.order.amount = this.order.subtotal + this.order.shipfee;
    // return this;
  }

  static modifyOrders = async ({ data, seller }: any) => {
    const { items, sellerId } = data;

    // kiểm tra danh sách
    const itemsLength = Object.keys(items).length;
    if (itemsLength === 0)
      throw ErrorHelper.requestDataInvalid(
        ". Không có sản phẩm trong đơn hàng"
      );

    const productIds = items.map((i: any) => i.productId).map(Types.ObjectId);

    let orders: any = [];

    const addQuantitytoProduct = (product: IProduct, items: any) => {
      product.qty = items.find(
        (item: any) => item.productId === product._id.toString()
      ).quantity;
      return product;
    };

    const getPostProducts = (productsInOrder: IProduct[]) => {
      console.log("getPostProducts");
      const products = productsInOrder.filter((p) => p.isPrimary);
      if (products.length > 0) {
        orders.push({
          ...data,
          isPrimary: true,
          orderType: OrderType.POST,
          products,
          fromMemberId: sellerId,
        });
      }
    };

    const getShopProducts = (productsInOrder: IProduct[]) => {
      console.log("getShopProducts");
      const products = productsInOrder.filter(
        (p) => p.isPrimary === false && p.isCrossSale === false
      );
      // console.log('seller',seller);

      if (products.length > 0) {
        if (!seller.allowSale) {
          throw ErrorHelper.requestDataInvalid(
            ". Sản phẩm mở rộng chưa được phép mua ở bưu cục này"
          );
        }

        orders.push({
          ...data,
          isPrimary: false,
          orderType: OrderType.SHOP,
          products,
          fromMemberId: sellerId,
        });
      }
    };

    const getCrossSaleProducts = async (products: IProduct[]) => {
      console.log("getCrossSaleProducts");

      products = products
        .filter((p) => p.isPrimary === false && p.isCrossSale === true)
        .map((product: any) => ({
          ...product._doc,
          qty: product.qty,
          memberId: product.memberId.toString(),
        }));

      // console.log("products", products);

      const productsLength = Object.values(products).length;

      // kiem tra san pham co trong kho ban cheo cua chu shop do ko ?
      const productIds = products.map((product) => product._id.toString());
      // .map(Types.ObjectId);
      const crossaleParams = {
        productId: { $in: productIds },
        sellerId,
      };

      // console.log("crossaleParams", crossaleParams);
      const existedProductsLength = await CrossSaleModel.count(crossaleParams);

      if (productsLength !== existedProductsLength) {
        throw ErrorHelper.requestDataInvalid(". Sản phẩm bán chéo không đúng");
      }

      // console.log("newProducts", newProducts);
      const orderedProducts = products.reduce((r: any, a: any) => {
        // console.log("a", a);
        // console.log("r", r);
        r[a.memberId] = [...(r[a.memberId] || []), a];
        return r;
      }, {});

      Object.values(orderedProducts).map((products: any) => {
        orders.push({
          ...data,
          products,
          isPrimary: false,
          isCrossSale: true,
          orderType: OrderType.CROSSSALE,
          sellerId: products[0].memberId,
          fromMemberId: sellerId,
        });
        return products;
      });
    };

    const products = await ProductModel.find({
      _id: { $in: productIds },
      allowSale: true,
    }).then((products) =>
      products.map((product) => addQuantitytoProduct(product, items))
    );
    // console.log("products",products.map(p=>p.qty));

    const productsLength = Object.keys(products).length;
    if (itemsLength !== productsLength)
      throw ErrorHelper.requestDataInvalid(
        ". Sản phẩm trong đơn hàng không tồn tại"
      );

    // console.log("products", products);
    getPostProducts(products);
    getShopProducts(products);
    await getCrossSaleProducts(products);
    // console.log("orders", orders);
    // console.log("orders", orders.length);
    return orders;
  };

  static async fromRaw({ orderData, customer, seller }: any) {
    console.log("fromRaw");
    const order = new OrderModel(orderData);

    // console.log("order",order);
    let { collaboratorId } = orderData;
    let collaborator = null;
    if (collaboratorId) {
      collaborator = await CollaboratorModel.findById(collaboratorId);
    } else {
      collaborator = await CollaboratorModel.findOne({
        phone: customer.phone,
        memberId: orderData.sellerId,
      });
    }

    order.collaboratorId = collaborator ? collaborator.id : null;
    order.sellerCode = seller.code;
    order.sellerName = seller.shopName ? seller.shopName : seller.name;

    const helper = new OrderHelper(order);
    switch (order.shipMethod) {
      case ShipMethod.NONE:
        await Promise.all([
          helper.setProvinceName(),
          helper.setDistrictName(),
          helper.setWardName(),
        ]);
        break;

      case ShipMethod.POST:
        break;

      case ShipMethod.VNPOST:
        await Promise.all([
          helper.setProvinceName(),
          helper.setDistrictName(),
          helper.setWardName(),
        ]);
        break;
    }
    return helper;
  }

  async fromItemsRaw({ products, unitPrice, seller }: any) {
    this.order.subtotal = 0;
    this.order.itemCount = 0;
    this.order.itemIds = [];
    this.order.items = [];
    this.order.itemWeight = 0;

    for (let i of products) {
      const {
        _id,
        qty,
        name,
        basePrice,
        weight,
        length,
        width,
        height,
        isPrimary,
        isCrossSale,
        commission0,
        commission1,
        commission2,
        commission3,
        enabledMemberBonus,
        enabledCustomerBonus,
        memberBonusFactor,
        customerBonusFactor,
      }: IProduct = i;

      const orderItem: any = {
        orderId: this.order._id,
        productId: _id,
        productName: name,
        isPrimary,
        isCrossSale,
        basePrice: basePrice,
        qty: qty,
        amount: basePrice * qty,
        productWeight: weight,
        productHeight: height,
        productLength: length,
        productWidth: width,
        commission0: 0,
        commission1: 0,
        commission2: 0,
        commission3: 0,
        orderType: this.order.orderType,
      };

      // kiem tra san pham - hoa hong vnpost > 0
      // kiem tra don hang - primary ko
      if (commission0 > 0) {
        if (this.order.isPrimary) {
          orderItem.commission0 = commission0;
        }
      }

      // kiem tra san pham - hoa hong chu shop > 0
      // kiem tra don hang - co chu shop ko ?
      if (commission1 > 0) {
        if (this.order.fromMemberId) {
          orderItem.commission1 = commission1;
        }
      }

      // kiem tra san pham - hoa hong nguoi gioi thieu > 0
      // kiem tra don hang - kiem tra cong tac vien
      if (commission2 > 0) {
        if (this.order.collaboratorId) {
          orderItem.commission2 = commission2;
        } else {
          // hoa hong chu shop gioi thieu chu shop
          if (seller) {
            orderItem.commission2 = commission2;
          }
        }
      }

      // kiem tra san pham - hh kho > 0
      // kiem tra don hang - co kho chuyen ko ?

      if (commission3 > 0) {
        orderItem.commission3 = commission3;
      }

      const getPointFromPrice = (factor: any, price: any) =>
        Math.round(((price / unitPrice) * 100) / 100) * factor;
      // Điểm thưởng khách hàng
      if (enabledCustomerBonus)
        orderItem.buyerBonusPoint = getPointFromPrice(
          customerBonusFactor,
          basePrice
        );
      // Điểm thưởng chủ shop
      if (enabledMemberBonus)
        orderItem.sellerBonusPoint = getPointFromPrice(
          memberBonusFactor,
          basePrice
        );

      const item = new OrderItemModel(orderItem);
      this.order.items.push(item);

      this.order.subtotal += item.amount;
      this.order.itemCount += item.qty;
      this.order.itemWeight += item.productWeight * item.qty;
      this.order.commission0 += item.commission0 * item.qty;
      this.order.commission1 += item.commission1 * item.qty;
      this.order.commission2 += item.commission2 * item.qty;
      this.order.commission3 += item.commission3 * item.qty;

      this.order.sellerBonusPoint += item.sellerBonusPoint;
      this.order.buyerBonusPoint += item.buyerBonusPoint;

      this.order.itemIds.push(item._id);
    }

    // lay kich thuoc lon nhat

    this.order.itemHeight = Math.max.apply(
      null,
      products.map(({ height }: any) => height)
    );
    this.order.itemLength = Math.max.apply(
      null,
      products.map(({ length }: any) => length)
    );
    this.order.itemWidth = Math.max.apply(
      null,
      products.map(({ width }: any) => width)
    );

    return this.order.items;
  }

  async calculateShipfee({ seller }: any) {
    // console.log('calculateShipfee----calculateShipfee')
    this.order.shipfee = 0;

    const { addressStorehouseIds, mainAddressStorehouseId } = seller;
    const storehouses = await AddressStorehouseModel.find({
      _id: { $in: addressStorehouseIds },
      activated: true,
    });

    switch (this.order.shipMethod) {
      case ShipMethod.NONE:
        this.order.shipfee = await SettingHelper.load(
          SettingKey.DELIVERY_ORDER_SHIP_FEE
        );
        break;

      case ShipMethod.POST:
        if (storehouses.length === 0)
          throw ErrorHelper.somethingWentWrong("Chưa cấu hình chi nhánh kho");

        if (
          seller.addressDeliveryIds.findIndex(
            (id: any) =>
              id.toString() == this.order.addressDeliveryId.toString()
          ) === -1
        ) {
          throw ErrorHelper.somethingWentWrong("Mã địa điểm nhận không đúng");
        }

        const addressDelivery = await AddressDeliveryModel.findOne({
          _id: this.order.addressDeliveryId,
          activated: true,
        });

        if (!addressDelivery) {
          throw ErrorHelper.mgRecoredNotFound("Địa điểm nhận hàng");
        }
        // console.log("-------------------------->storehouses", storehouses);

        this.order.shipfee = await SettingHelper.load(
          SettingKey.DELIVERY_POST_FEE
        );

        break;

      case ShipMethod.VNPOST:
        const defaultServiceCode = await SettingHelper.load(
          SettingKey.VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE
        );

        const urbanStores = storehouses.filter(
          (store) => store.provinceId === this.order.buyerProvinceId
        );

        this.order.isUrbanDelivery = urbanStores.length > 0;

        const longitude = this.order.longitude ? this.order.longitude : 0;
        const latitude = this.order.latitude ? this.order.latitude : 0;

        const addressStorehouse = await AddressStorehouseModel.findOne({
          allowPickup: true,
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
          },
        });

        const addressStorehouseId = addressStorehouse
          ? addressStorehouse.id
          : seller.mainAddressStorehouseId;

        const cheapestService = await calculateServiceByMainStorehouse(
          addressStorehouseId,
          this
        );

        const cheapestShipFee = cheapestService.TongCuocBaoGomDVCT;

        this.order.shipfee = cheapestShipFee;

        this.order.addressStorehouseId = cheapestService.storehouse._id;

        const deliveryInfo: any = {
          serviceName: defaultServiceCode,
          codAmountEvaluation: cheapestService.codAmountEvaluation,
          deliveryDateEvaluation: cheapestService.ThoiGianPhatDuKien,
          heightEvaluation: cheapestService.productHeight,
          isReceiverPayFreight: false,
          lengthEvaluation: cheapestService.productLength,
          weightEvaluation: cheapestService.productWeight,
          widthEvaluation: cheapestService.productWidth,
          packageContent: this.order.items
            .map((i) => `[${i.productName} - SL:${i.qty}]`)
            .join(" "),
          isPackageViewable: false,
          pickupType: PickupType.DROP_OFF,

          senderFullname: seller.shopName ? seller.shopName : seller.name, // tên người gửi *
          senderTel: cheapestService.storehouse.phone, // Số điện thoại người gửi * (maxlength: 50)
          senderAddress: cheapestService.storehouse.address, // địa chỉ gửi *
          senderWardId: cheapestService.storehouse.wardId, // mã phường người gửi *
          senderProvinceId: cheapestService.storehouse.provinceId, // mã tỉnh người gửi *
          senderDistrictId: cheapestService.storehouse.districtId, // mã quận người gửi *

          receiverFullname: this.order.buyerName, // tên người nhận *
          receiverAddress: this.order.buyerAddress, // địa chỉ nhận *
          receiverTel: this.order.buyerPhone, // phone người nhận *
          receiverProvinceId: this.order.buyerProvinceId, // mã tỉnh người nhận *
          receiverDistrictId: this.order.buyerDistrictId, // mã quận người nhận *
          receiverWardId: this.order.buyerWardId, // mã phường người nhận *
          partnerFee: cheapestShipFee,
        };

        this.order.deliveryInfo = deliveryInfo;
        break;

      default:
        throw ErrorHelper.requestDataInvalid(
          "Phương thức vận chuyển chưa được hỗ trợ."
        );
    }
    return this;
  }

  async addCampaign(campaignCode: string) {
    const campaign = await CampaignModel.findOne({
      code: campaignCode,
    });

    // console.log("campaign", campaign);
    if (campaign) {
      const campaignSocialResults = await CampaignSocialResultModel.find({
        memberId: this.order.sellerId,
        campaignId: campaign.id,
      });
      // console.log("campaignSocialResults", campaignSocialResults);

      const items = this.order.items.map((item: IOrderItem) => {
        const campaignResultByProductId = campaignSocialResults.find(
          (c: ICampaignSocialResult) =>
            c.productId.toString() == item.productId.toString()
        );
        // console.log('campaignResultByProductId', campaignResultByProductId);
        if (campaignResultByProductId) {
          item.campaignId = campaign._id;
          item.campaignSocialResultId = campaignResultByProductId._id;
        }
        return item;
      });

      // console.log("items", items);

      set(this.order, "items", items);
      // console.log("items", this.order.items);
    }
  }

  async updateOrderedQtyBulk() {
    // console.log("updateOrderedQtyBulk");
    const productBulk = ProductModel.collection.initializeUnorderedBulkOp();
    this.order.items.map((item: IOrderItem) => {
      const { productId } = item;
      productBulk.find({ productId }).updateOne({
        $inc: { crossSaleOrdered: item.qty },
      });
      if (item.isCrossSale) {
      }
    });
    return productBulk;
  }
}

const calculateServiceByMainStorehouse = async (
  mainStorehouseId: string,
  orderHelper: OrderHelper
) => {
  const defaultServiceCode = await SettingHelper.load(
    SettingKey.VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE
  );

  const storehouse = await AddressStorehouseModel.findById(mainStorehouseId);

  // console.log("-------------> ", orderHelper.order);

  let MaTinhGui = storehouse.provinceId,
    MaQuanGui = storehouse.districtId,
    MaTinhNhan = orderHelper.order.buyerProvinceId,
    MaQuanNhan = orderHelper.order.buyerDistrictId;

  const codAmountEvaluation =
    orderHelper.order.paymentMethod == PaymentMethod.COD
      ? orderHelper.order.subtotal
      : 0;

  const productWeight = orderHelper.order.itemWeight;
  const productLength = orderHelper.order.itemLength;
  const productWidth = orderHelper.order.itemWidth;
  const productHeight = orderHelper.order.itemHeight;

  const LstDichVuCongThem = [];

  orderHelper.order.paymentMethod == PaymentMethod.COD &&
    LstDichVuCongThem.push({
      DichVuCongThemId: 3,
      TrongLuongQuyDoi: 0,
      SoTienTinhCuoc: orderHelper.order.subtotal.toString(),
    });
  const data: ICalculateAllShipFeeRequest = {
    MaDichVu: defaultServiceCode,
    MaTinhGui,
    MaQuanGui,
    MaTinhNhan,
    MaQuanNhan,
    Dai: productLength,
    Rong: productWidth,
    Cao: productHeight,
    KhoiLuong: productWeight,
    ThuCuocNguoiNhan: orderHelper.order.paymentMethod == PaymentMethod.COD,
    LstDichVuCongThem,
  };

  // console.log("data", data);
  // noi thanh

  const service: ICalculateAllShipFeeRespone = await VietnamPostHelper.calculateAllShipFee(
    data
  );

  return {
    ...service,
    storehouse,
    codAmountEvaluation,
    productWeight,
    productLength,
    productWidth,
    productHeight,
  };
};

// STT
// Sản phẩm
// Cộng tác viên
// Bưu cục
// Chi nhánh
// Quận/Huyện
// Tổng số đơn	thanh cộng
// Tổng doanh thu
// Hoa hồng thực nhận
