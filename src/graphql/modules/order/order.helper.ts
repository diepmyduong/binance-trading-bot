import { chain, keyBy } from "lodash";
import {
  ErrorHelper,
  ICalculateAllShipFeeRequest,
  ICalculateAllShipFeeRespone,
  VietnamPostHelper,
} from "../../../helpers";
import { AddressModel } from "../address/address.model";
// import { addressService } from "../address/address.service";
import { CounterModel } from "../counter/counter.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { IOrder, OrderModel, PaymentMethod, ShipMethod } from "./order.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import { AddressStorehouseModel } from "../addressStorehouse/addressStorehouse.model";
import { MemberModel } from "../member/member.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
import { addressService } from "../address/address.service";

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

  static createOrdersDataRaw = async (data: any) => {
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

    // lấy ra danh sách sản phẩm của shop đó bán + sản phẩm chính (hảng bưu điện chuyển về cho bưu cục quản trị)
    const directShoppingProducts: any = allProducts
      .filter(
        (p) =>
          (p.memberId == sellerId && p.isCrossSale === false) || p.isPrimary
      )
      .map(addQuantitytoProduct);

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
    }

    return orders;
  };

  static async fromRaw(data: any) {
    const order = new OrderModel(data);
    // if (order.paymentMethod == PaymentMethod.) order.paymentStatus = PaymentStatus.PAID;
    const helper = new OrderHelper(order);
    await Promise.all([
      helper.setProvinceName(),
      helper.setDistrictName(),
      helper.setWardName(),
    ]);
    return helper;
  }

  async generateItemsFromRaw(products: any[]) {
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
      }: IProduct = i;

      const orderItem: any = {
        orderId: this.order._id,
        productId: _id,
        productName: name,
        basePrice: basePrice,
        qty: qty,
        amount: basePrice * qty,
        productWeight: weight,
        productHeight: height,
        productLength: length,
        productWidth: width,
      };

      const item = new OrderItemModel(orderItem);
      this.order.items.push(item);
      this.order.subtotal += item.amount;
      this.order.itemCount += item.qty;
      this.order.itemWeight += item.productWeight * item.qty;
      this.order.itemIds.push(item._id);
    }

    const itemHeight = products.reduce((prev, current) =>
      prev.height > current.height ? prev : current
    );
    const itemLength = products.reduce((prev, current) =>
      prev.length > current.length ? prev : current
    );
    const itemWidth = products.reduce((prev, current) =>
      prev.width > current.width ? prev : current
    );

    console.log('itemHeight',itemHeight);
    console.log('itemLength',itemLength);
    console.log('itemWidth',itemWidth);

    this.order.itemHeight = itemHeight;
    this.order.itemLength = itemLength;
    this.order.itemWidth = itemWidth;


    return this.order.items;
  }

  async calculateShipfee() {
    this.order.shipfee = 0;
    switch (this.order.shipMethod) {
      case ShipMethod.NONE:
        break;
      case ShipMethod.VNPOST:
        const member = await MemberModel.findById(this.order.sellerId);

        // console.log('this.order',this.order);
        // console.log('member',member);
        const { addressStorehouseIds } = member;

        // console.log('addressStorehouseIds',addressStorehouseIds);

        const storehouses = await AddressStorehouseModel.find({
          _id: { $in: addressStorehouseIds },
        });
        if (storehouses.length === 0)
          throw ErrorHelper.somethingWentWrong("Chưa cấu hình chi nhánh kho");

        let serviceList = [];

        for (const storehouse of storehouses) {
          let MaTinhGui = storehouse.provinceId,
            MaQuanGui = storehouse.districtId,
            MaTinhNhan = this.order.buyerProvinceId,
            MaQuanNhan = this.order.buyerDistrictId;

          const moneyCollection =
            this.order.paymentMethod == PaymentMethod.COD
              ? this.order.subtotal
              : 0;

          const productWeight = this.order.itemWeight;
          const productLength = this.order.itemLength;
          const productWidth = this.order.itemWidth;
          const productHeight = this.order.itemHeight;

          const LstDichVuCongThem = [
            {
              DichVuCongThemId: 3,
              TrongLuongQuyDoi: 0,
              SoTienTinhCuoc: this.order.subtotal,
            },
          ];

          const data: ICalculateAllShipFeeRequest = {
            MaDichVu: "BK",
            MaTinhGui,
            MaQuanGui,
            MaTinhNhan,
            MaQuanNhan,
            Dai: productLength,
            Rong: productWidth,
            Cao: productHeight,
            KhoiLuong: productWeight,
            ThuCuocNguoiNhan: PaymentMethod.COD ? true : false,
            LstDichVuCongThem,
          };

          let service: ICalculateAllShipFeeRespone = await VietnamPostHelper.calculateAllShipFee(
            data
          );
          serviceList.push({
            ...service,
            storehouse,
            moneyCollection,
            productWeight,
            productLength,
            productWidth,
            productHeight,
          });
        }

        serviceList = serviceList.sort(
          (a, b) => a.TongCuocDichVuCongThem - b.TongCuocDichVuCongThem
        );
        // let service = services.find((s) => s.code == "BK");
        // if (!service) service = services.find((s) => s.code == "NCOD");
        // if (!service) service = services[0];
        const cheapestService = serviceList[0];
        // console.log("cheapestService", cheapestService);
        this.order.shipfee = cheapestService.TongCuocDichVuCongThem;
        this.order.deliveryInfo = {
          date: new Date(),
          serviceId: "BK",
          // serviceName: service.name,
          time: cheapestService.ThoiGianPhatDuKien,
          addressStorehouseId: cheapestService.storehouse._id,
          moneyCollection: cheapestService.moneyCollection,
          productName: this.order.items.map((i) => i.productName).join(" + "),
          productWeight: cheapestService.productWeight,
          productLength: cheapestService.productLength,
          productWidth: cheapestService.productWidth,
          productHeight: cheapestService.productHeight,
          // orderPayment: ,
        };
        break;
      default:
        throw ErrorHelper.requestDataInvalid(
          "Phương thức vận chuyển chưa được hỗ trợ."
        );
    }
    return this;
  }
}
