import { ErrorHelper } from "../../../helpers";
import { AddressModel } from "../address/address.model";
import { addressService } from "../address/address.service";
import { CounterModel } from "../counter/counter.model";
import { IOrder, OrderModel } from "./order.model";

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

  static async fromRaw(data: any) {
    const order = new OrderModel(data);
    // if (order.isAnonymous) order.customerName = "Khách vảng lai";
    // if (order.paymentMethod == PaymentMethod.CASH) order.paymentStatus = PaymentStatus.PAID;
    // await Promise.all([
    //   addressService.setProvinceName(order),
    //   addressService.setDistrictName(order),
    //   addressService.setWardName(order),
    // ]);
    return new OrderHelper(order);
  }

  async generateItemsFromRaw(items: any[]) {
    // this.order.subtotal = 0;
    // this.order.itemCount = 0;
    // this.order.itemIds = [];
    // this.order.items = [];
    // this.order.itemWeight = 0;
    // const productKeyById = await ProductModel.find({
    //   _id: items.map((i: any) => i.productId),
    // }).then((res) => keyBy(res, "_id"));
    // for (let i of items) {
    //   const { productId, quantity, note } = i;
    //   const product = productKeyById[productId];
    //   if (quantity < 1) throw ErrorHelper.requestDataInvalid("Số lượng sản phẩm phải nhiều hơn 1");
    //   if (!product) {
    //     throw ErrorHelper.requestDataInvalid("Sản phẩm không tồn tại");
    //   }
    //   const salePrice = new ProductHelper(product).getSalePrice();
    //   const productDiscount = (product.basePrice - salePrice) * quantity;
    //   const item = new OrderItemModel({
    //     orderId: this.order._id,
    //     productId: product._id,
    //     productMasterId: product.productMasterId,
    //     isOffer: false,
    //     productName: product.name,
    //     attributes: product.attributes,
    //     basePrice: product.basePrice,
    //     saleType: product.saleType,
    //     saleValue: product.saleValue,
    //     hasSale: product.hasSale,
    //     quantity: quantity,
    //     qtyRemaining: quantity,
    //     discount: productDiscount,
    //     salePrice: salePrice,
    //     amount: salePrice * quantity,
    //     note: note,
    //     productWeight: product.weight,
    //   });
    //   this.order.items.push(item);
    //   this.order.subtotal += item.amount;
    //   this.order.itemCount += item.quantity;
    //   this.order.itemWeight += item.productWeight * item.quantity;
    //   this.order.itemIds.push(item._id);
    //   this.productBulk.find({ _id: product._id }).updateOne({ $inc: { orderQty: item.quantity } });
    // }
    // return this.order.items;
  }

  calculateAmount() {
    // this.order.amount = this.order.subtotal + this.order.shipfee - this.order.discount;
    // return this;
  }
}
