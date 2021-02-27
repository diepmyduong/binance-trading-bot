import { chain, keyBy } from "lodash";
import {
  ErrorHelper,
  ICalculateAllShipFeeRequest,
  ICalculateAllShipFeeRespone,
  ServiceCode,
  VietnamPostHelper,
  DeliveryServices,
  PickupType,
} from "../../../helpers";
import { AddressModel } from "../address/address.model";
import { CounterModel } from "../counter/counter.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { IOrder, OrderModel, PaymentMethod, ShipMethod } from "./order.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import { AddressStorehouseModel } from "../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../member/member.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { CampaignModel } from "../campaign/campaign.model";
import {
  CampaignSocialResultModel,
  ICampaignSocialResult,
} from "../campaignSocialResult/campaignSocialResult.model";
import { UnorderedBulkOperation } from "mongodb";
import { AddressDeliveryModel } from "../addressDelivery/addressDelivery.model";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import memberGetMeResolver from "../member/resolvers/memberGetMe.resolver";
import { CustomerModel } from "../customer/customer.model";

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

  static orderProducts = async (data: any) => {
    const { items, sellerId } = data;

    // kiểm tra danh sách
    const itemsLength = Object.keys(items).length;
    if (itemsLength === 0)
      throw ErrorHelper.requestDataInvalid("Danh sách sản phẩm");

    const itemIDs = items.map((i: any) => i.productId);

    const allProducts = await ProductModel.find({
      _id: { $in: itemIDs },
      type: ProductType.RETAIL,
      allowSale: true,
    });

    const productsLength = Object.keys(allProducts).length;
    if (productsLength !== itemsLength)
      throw ErrorHelper.mgQueryFailed("Danh sách sản phẩm");

    const addQuantitytoProduct = (product: any) => {
      product.qty = items.find((p: any) => p.productId === product.id).quantity;
      return product;
    };

    // console.log('allProducts',allProducts);
    // console.log('sellerId',sellerId);

    const validDirectShop = (p: IProduct) => {
      // console.log('p.memberId',p.memberId);
      // console.log('sellerId',sellerId);
      return p.memberId == sellerId && p.isCrossSale === false;
    };
    // lấy ra danh sách sản phẩm của shop đó bán + sản phẩm chính (hảng bưu điện chuyển về cho bưu cục quản trị)
    const directShoppingProducts: any = allProducts
      .filter((p) => validDirectShop(p))
      .map(addQuantitytoProduct);

    // console.log('directShoppingProducts',directShoppingProducts);

    // lấy ra danh sách sản phẩm của shop bán chéo
    const crossSaleProducts = allProducts
      .filter((p) => p.isCrossSale === true)
      .map(addQuantitytoProduct);

    // shop bán chéo thì phải check số lượng hàng tồn
    const outOfStockProducts: string[] = [];

    const isOutOfStock = ({
      id,
      name,
      crossSaleInventory: dbInventory,
      crossSaleOrdered: dbOrdered,
    }: any) => {
      const orderItem = items.find((i: any) => i.productId === id);
      const condition = dbInventory < dbOrdered + orderItem.quantity;
      condition && outOfStockProducts.push(name);
      return condition;
    };

    // console.log('crossSaleProducts.some(isOutOfStock)', crossSaleProducts.some(isOutOfStock));
    if (crossSaleProducts.some(isOutOfStock)) {
      throw ErrorHelper.requestDataInvalid(
        `. Sản phẩm [${outOfStockProducts.join(",")}] hết hàng.`
      );
    }

    const orders = [];

    if (directShoppingProducts.length > 0) {
      orders.push({
        ...data,
        products: directShoppingProducts,
        fromMemberId: sellerId,
      });
    }

    if (crossSaleProducts.length > 0) {
      const ids = crossSaleProducts.map((p: any) => p._id);
      // console.log("ids", ids);

      // // lay cac mat hang crossale ra
      const crossSales = await CrossSaleModel.find({
        productId: { $in: ids },
        sellerId,
      });

      // console.log("crossSales", crossSales);
      // kiem tra mat hang nay co trong dang ky crossale ko ?
      if (crossSales.length !== crossSaleProducts.length)
        throw ErrorHelper.mgQueryFailed("Danh sách sản phẩm bán chéo");

      // tach cac san pham nay ra theo tung chu shop
      chain(crossSaleProducts)
        .groupBy("memberId")
        .map((products, i) => {
          orders.push({
            ...data,
            products,
            sellerId: i,
            fromMemberId: sellerId,
          });
        });

      // them danh sach order - cong tac vien mua don hang ban cheo
    }

    return orders;
  };

  static async fromRaw(data: any) {
    const order = new OrderModel(data);
    
    const customer = await CustomerModel.findById(order.buyerId);
    const collaborator = await CollaboratorModel.findOne({
      phone: customer.phone,
    });

    if(collaborator){
      order.isCollaborator = true;
    }

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

  async generateItemsFromRaw(products: any) {
    const UNIT_PRICE = await SettingHelper.load(SettingKey.UNIT_PRICE);
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
        commission0,
        commission1,
        commission2,
      };

      const getPointFromPrice = (factor: any, price: any) =>
        Math.round(((price / UNIT_PRICE) * 100) / 100) * factor;
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
      this.order.commission0 += item.commission0;
      this.order.commission1 += item.commission1;
      this.order.commission2 += item.commission2;

      this.order.sellerBonusPoint += item.sellerBonusPoint;
      this.order.buyerBonusPoint += item.buyerBonusPoint;

      this.order.itemIds.push(item._id);
    }

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

  async calculateShipfee() {
    this.order.shipfee = 0;
    const deliveryServices = DeliveryServices;
    const serviceCode = await SettingHelper.load(
      SettingKey.VNPOST_DEFAULT_SHIP_SERVICE_METHOD_CODE
    );

    const member = await MemberModel.findById(this.order.sellerId);
    const { addressStorehouseIds } = member;
    const storehouses = await AddressStorehouseModel.find({
      _id: { $in: addressStorehouseIds },
      activated: true,
    });
    let deliveryInfo: any = null;

    switch (this.order.shipMethod) {
      case ShipMethod.NONE:
        this.order.shipfee = await SettingHelper.load(
          SettingKey.DELIVERY_ORDER_SHIP_FEE
        );
        break;

      case ShipMethod.POST:
        let servicePostList = [];
        if (storehouses.length === 0)
          throw ErrorHelper.somethingWentWrong("Chưa cấu hình chi nhánh kho");

        // console.log('member.addressDeliveryIds',member.addressDeliveryIds);

        if (
          member.addressDeliveryIds.findIndex(
            (id) => id.toString() == this.order.addressDeliveryId.toString()
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
        for (const storehouse of storehouses) {
          let MaTinhGui = storehouse.provinceId,
            MaQuanGui = storehouse.districtId,
            MaTinhNhan = addressDelivery.provinceId,
            MaQuanNhan = addressDelivery.districtId;

          this.order.shipfee = await SettingHelper.load(
            SettingKey.DELIVERY_POST_FEE
          );

          const moneyCollection =
            this.order.paymentMethod == PaymentMethod.COD
              ? this.order.subtotal
              : 0;

          const productWeight = this.order.itemWeight;
          const productLength = this.order.itemLength;
          const productWidth = this.order.itemWidth;
          const productHeight = this.order.itemHeight;

          const LstDichVuCongThem = [];

          this.order.paymentMethod == PaymentMethod.COD &&
            LstDichVuCongThem.push({
              DichVuCongThemId: 3,
              TrongLuongQuyDoi: 0,
              SoTienTinhCuoc: this.order.subtotal.toString(),
            });

          const data: ICalculateAllShipFeeRequest = {
            MaDichVu: serviceCode,
            MaTinhGui,
            MaQuanGui,
            MaTinhNhan,
            MaQuanNhan,
            Dai: productLength,
            Rong: productWidth,
            Cao: productHeight,
            KhoiLuong: productWeight,
            ThuCuocNguoiNhan: false,
            LstDichVuCongThem,
          };

          // console.log("data", data);

          let service: ICalculateAllShipFeeRespone = await VietnamPostHelper.calculateAllShipFee(
            data
          );

          servicePostList.push({
            ...service,
            storehouse,
            addressDelivery,
            moneyCollection,
            productWeight,
            productLength,
            productWidth,
            productHeight,
          });
        }

        servicePostList = servicePostList.sort(
          (a, b) => a.TongCuocBaoGomDVCT - b.TongCuocBaoGomDVCT
        );

        const cheapestPostService = servicePostList[0];

        // đơn này ko thu tiền ship
        this.order.addressStorehouseId = cheapestPostService.storehouse._id;
        this.order.addressDeliveryId = cheapestPostService.addressDelivery._id;

        this.order.isUrbanDelivery = false;
        deliveryInfo = {
          serviceName: serviceCode,
          codAmountEvaluation: cheapestPostService.moneyCollection,
          deliveryDateEvaluation: cheapestPostService.ThoiGianPhatDuKien,
          heightEvaluation: cheapestPostService.productHeight,
          isReceiverPayFreight: false,
          lengthEvaluation: cheapestPostService.productLength,
          weightEvaluation: cheapestPostService.productWeight,
          widthEvaluation: cheapestPostService.productWidth,
          packageContent: this.order.items
            .map((i) => `[${i.productName} - SL:${i.qty}]`)
            .join(" "),
          isPackageViewable: false,
          pickupType: PickupType.PICK_UP,

          senderFullname: member.shopName, // tên người gửi *
          senderTel: cheapestPostService.storehouse.phone, // Số điện thoại người gửi * (maxlength: 50)
          senderAddress: cheapestPostService.storehouse.address, // địa chỉ gửi *
          senderWardId: cheapestPostService.storehouse.wardId, // mã phường người gửi *
          senderProvinceId: cheapestPostService.storehouse.provinceId, // mã tỉnh người gửi *
          senderDistrictId: cheapestPostService.storehouse.districtId, // mã quận người gửi *

          receiverFullname: this.order.buyerName, // tên người nhận *
          receiverTel: this.order.buyerPhone, // phone người nhận *
          receiverAddress: cheapestPostService.addressDelivery.address, // địa chỉ nhận *
          receiverProvinceId: cheapestPostService.addressDelivery.provinceId, // mã tỉnh người nhận *
          receiverDistrictId: cheapestPostService.addressDelivery.districtId, // mã quận người nhận *
          receiverWardId: cheapestPostService.addressDelivery.wardId, // mã phường người nhận *
        };

        this.order.deliveryInfo = deliveryInfo;
        break;

      case ShipMethod.VNPOST:
        // console.log('Vao VNPOST');
        // kiem tra đơn hàng trong nội thành ?
        const urbanStores = storehouses.filter(
          (store) => store.provinceId === this.order.buyerProvinceId
        );

        let serviceList = [];
        for (const storehouse of storehouses) {
          let MaTinhGui = storehouse.provinceId,
            MaQuanGui = storehouse.districtId,
            MaTinhNhan = this.order.buyerProvinceId,
            MaQuanNhan = this.order.buyerDistrictId;

          const codAmountEvaluation =
            this.order.paymentMethod == PaymentMethod.COD
              ? this.order.subtotal
              : 0;

          const productWeight = this.order.itemWeight;
          const productLength = this.order.itemLength;
          const productWidth = this.order.itemWidth;
          const productHeight = this.order.itemHeight;

          const LstDichVuCongThem = [];

          this.order.paymentMethod == PaymentMethod.COD &&
            LstDichVuCongThem.push({
              DichVuCongThemId: 3,
              TrongLuongQuyDoi: 0,
              SoTienTinhCuoc: this.order.subtotal.toString(),
            });

          // console.log("Vao VNPOST", this.order);

          const data: ICalculateAllShipFeeRequest = {
            MaDichVu: ServiceCode.BK,
            MaTinhGui,
            MaQuanGui,
            MaTinhNhan,
            MaQuanNhan,
            Dai: productLength,
            Rong: productWidth,
            Cao: productHeight,
            KhoiLuong: productWeight,
            ThuCuocNguoiNhan: this.order.paymentMethod == PaymentMethod.COD,
            LstDichVuCongThem,
          };

          // console.log('data',data);

          let service: ICalculateAllShipFeeRespone = await VietnamPostHelper.calculateAllShipFee(
            data
          );

          serviceList.push({
            ...service,
            storehouse,
            codAmountEvaluation,
            productWeight,
            productLength,
            productWidth,
            productHeight,
          });
        }
        // console.log("serviceList", serviceList);

        serviceList = serviceList.sort(
          (a, b) => a.TongCuocBaoGomDVCT - b.TongCuocBaoGomDVCT
        );

        const cheapestService = serviceList[0];
        // console.log("cheapestService", cheapestService);
        // Đơn hàng nội thành - phí ship cố định
        if (urbanStores.length > 0) {
          this.order.isUrbanDelivery = true;
          this.order.shipfee = await SettingHelper.load(
            SettingKey.DELIVERY_VNPOST_INNER_SHIP_FEE
          );
        } else {
          this.order.isUrbanDelivery = false;
          this.order.shipfee =
            this.order.paymentMethod == PaymentMethod.COD
              ? cheapestService.TongCuocBaoGomDVCT
              : 0;
        }

        this.order.addressStorehouseId = cheapestService.storehouse._id;

        this.order.isUrbanDelivery = false;

        deliveryInfo = {
          serviceName: serviceCode,
          codAmountEvaluation: cheapestService.codAmountEvaluation,
          deliveryDateEvaluation: cheapestService.ThoiGianPhatDuKien,
          heightEvaluation: cheapestService.productHeight,
          isReceiverPayFreight: PaymentMethod.COD ? true : false,
          lengthEvaluation: cheapestService.productLength,
          weightEvaluation: cheapestService.productWeight,
          widthEvaluation: cheapestService.productWidth,
          packageContent: this.order.items
            .map((i) => `[${i.productName} - SL:${i.qty}]`)
            .join(" "),
          isPackageViewable: false,
          pickupType: PickupType.PICK_UP,

          senderFullname: member.shopName, // tên người gửi *
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

  async addCampaignBulk() {
    const campaign = await CampaignModel.findOne({
      code: this.order.campaignCode,
    });
    const campaignSocialResultBulk: UnorderedBulkOperation = CampaignSocialResultModel.collection.initializeUnorderedBulkOp();
    if (campaign) {
      const campaignSocialResults = campaign
        ? await CampaignSocialResultModel.find({
            memberId: this.order.sellerId,
            campaignId: campaign.id,
          })
        : [];

      this.order.items.map((item: IOrderItem) => {
        const campaignResultByProductId = campaignSocialResults.find(
          (c: ICampaignSocialResult) => c.productId.toString() == item.productId
        );
        if (campaign.productId.toString() === item.id) {
          item.campaignId = campaign._id;
          item.campaignSocialResultId = campaignResultByProductId._id;
          const { orderItemIds } = campaignResultByProductId;
          campaignSocialResultBulk
            .find({ _id: campaignResultByProductId._id })
            .updateOne({
              $set: { orderItemIds: [...orderItemIds, item._id] },
            });
        }
        return item;
      });
    }
    return campaignSocialResultBulk;
  }

  async updateOrderedQtyBulk() {
    const productBulk = ProductModel.collection.initializeUnorderedBulkOp();
    this.order.items.map((item: IOrderItem) => {
      if (item.isCrossSale) {
        const { productId } = item;
        productBulk.find({ productId }).updateOne({
          $inc: { crossSaleOrdered: item.qty },
        });
      }
    });
    // console.log("items", items);
    productBulk.execute();
  }
}
