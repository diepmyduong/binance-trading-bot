import _, { set, sumBy } from "lodash";
import { CrudService } from "../../../base/crudService";
import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { CampaignModel } from "../campaign/campaign.model";
import {
  CampaignSocialResultModel,
  ICampaignSocialResult,
} from "../campaignSocialResult/campaignSocialResult.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
import { IOrderItem, OrderItemModel } from "../orderItem/orderItem.model";
import { IOrderLog, OrderLogModel } from "../orderLog/orderLog.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { OrderHelper } from "./order.helper";
import { IOrder, OrderModel, OrderStatus } from "./order.model";
class OrderService extends CrudService<typeof OrderModel> {
  constructor() {
    super(OrderModel);
  }

  insertOrder = async (data: any) => {
    const {
      products,
      buyerId,
      sellerId,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      fromMemberId,
      isPrimary,
    } = data;

    //Kiểm tra số điện thoại hợp lệ
    if (buyerPhone) OrderHelper.validatePhone(buyerPhone);

    //create pre mongo model : Order
    const order = new OrderModel({
      code: await OrderHelper.generateCode(),
      buyerId,
      sellerId,
      fromMemberId,
      amount: 0,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      isPrimary,
    });

    const orderHelper = new OrderHelper(order);
    // Kiểm tra địa chỉ
    await Promise.all([
      orderHelper.setProvinceName(),
      orderHelper.setDistrictName(),
      orderHelper.setWardName(),
    ]);

    // // console.log('items', items);
    // console.log("products", products);
    const UNIT_PRICE = await SettingHelper.load(SettingKey.UNIT_PRICE);
    const VAT = 0;
    const DISCOUNT = 0;

    // Tạo bulk product
    const productBulk = ProductModel.collection.initializeUnorderedBulkOp();
    //create OrderItem
    const orderItems: IOrderItem[] = products.map(
      ({
        _id,
        id,
        basePrice,
        name,
        qty,
        isPrimary,
        commission0,
        commission1,
        commission2,
        enabledMemberBonus,
        enabledCustomerBonus,
        memberBonusFactor,
        customerBonusFactor,
      }: IProduct) => {
        let params: any = {
          productId: _id,
          orderId: order._id,
          buyerId,
          sellerId,
          basePrice,
          isPrimary,
          productName: name,
          qty,
          amount: qty * basePrice,
          commission0,
          commission1,
          commission2,
        };

        const getPointFromPrice = (factor: any, price: any) =>
          Math.round(((price / UNIT_PRICE) * 100) / 100) * factor;
        // Điểm thưởng khách hàng
        if (enabledCustomerBonus)
          params.buyerBonusPoint = getPointFromPrice(customerBonusFactor, basePrice);
        // Điểm thưởng chủ shop
        if (enabledMemberBonus)
          params.sellerBonusPoint = getPointFromPrice(memberBonusFactor, basePrice);

        // Tạo orderItem
        const orderItem = new OrderItemModel(params);

        // Update lại số lượng đặt trong product
        productBulk.find({ _id }).updateOne({
          $inc: { crossSaleOrdered: qty },
        });

        // console.log('orderItem', orderItem);
        return orderItem;
      }
    );

    order.subtotal = sumBy(orderItems, "amount");
    order.amount = sumBy(orderItems, "amount") + VAT - DISCOUNT;
    order.itemCount = sumBy(orderItems, "qty");

    order.commission0 = sumBy(orderItems, "commission0");
    order.commission1 = sumBy(orderItems, "commission1");
    order.commission2 = sumBy(orderItems, "commission2");

    order.sellerBonusPoint = sumBy(orderItems, "sellerBonusPoint");
    order.buyerBonusPoint = sumBy(orderItems, "buyerBonusPoint");

    order.itemIds = orderItems.map((oi) => oi._id);

    // Save lại
    return await Promise.all([
      order.save(),
      OrderItemModel.insertMany(orderItems),
      productBulk.execute(),
    ]).then((res) => {
      return res[0];
    });
  };

  insertMobifoneOrder = async (data: any, campaign: any) => {
    const {
      products,
      buyerId,
      sellerId,
      fromMemberId,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      isPrimary,
    } = data;

    //Kiểm tra số điện thoại hợp lệ
    if (buyerPhone) OrderHelper.validatePhone(buyerPhone);

    //create pre mongo model : Order
    const order = new OrderModel({
      code: await OrderHelper.generateCode(),
      buyerId,
      sellerId,
      fromMemberId,
      amount: 0,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      isPrimary,
    });

    const orderHelper = new OrderHelper(order);
    // Kiểm tra địa chỉ
    await Promise.all([
      orderHelper.setProvinceName(),
      orderHelper.setDistrictName(),
      orderHelper.setWardName(),
    ]);

    const productIds = products.map((p: any) => p.id);

    // // console.log('items', items);
    // console.log("products", products);
    const UNIT_PRICE = await SettingHelper.load(SettingKey.UNIT_PRICE);
    const VAT = 0;
    const DISCOUNT = 0;
    // Tạo bulk product
    const campaignSocialResultBulk = CampaignSocialResultModel.collection.initializeUnorderedBulkOp();
    const campaignSocialResults = campaign
      ? await CampaignSocialResultModel.find({
          memberId: sellerId,
          campaignId: campaign.id,
          productId: productIds,
        })
      : null;

    //create OrderItem
    const orderItems: IOrderItem[] = products.map(
      ({
        _id,
        id,
        basePrice,
        name,
        qty,
        isPrimary,
        commission0,
        commission1,
        commission2,
        enabledMemberBonus,
        enabledCustomerBonus,
        memberBonusFactor,
        customerBonusFactor,
      }: IProduct) => {
        let params: any = {
          productId: _id,
          orderId: order._id,
          buyerId,
          sellerId,
          basePrice,
          isPrimary,
          productName: name,
          qty,
          amount: qty * basePrice,
          commission0,
          commission1,
          commission2,
        };

        const getPointFromPrice = (factor: any, price: any) =>
          Math.round(((price / UNIT_PRICE) * 100) / 100) * factor;
        // Điểm thưởng khách hàng
        if (enabledCustomerBonus)
          params.buyerBonusPoint = getPointFromPrice(customerBonusFactor, basePrice);
        // Điểm thưởng chủ shop
        if (enabledMemberBonus)
          params.sellerBonusPoint = getPointFromPrice(memberBonusFactor, basePrice);

        if (campaign) {
          const campaignResultByProductId = campaignSocialResults.find(
            (c: ICampaignSocialResult) => c.productId.toString() == id.toString()
          );
          if (campaign.productId.toString() === id) {
            params.campaignId = campaign._id;
            params.campaignSocialResultId = campaignResultByProductId._id;
          }
        }

        // Tạo orderItem
        const orderItem = new OrderItemModel(params);

        if (campaign) {
          const campaignResultByProductId = campaignSocialResults.find(
            (c: ICampaignSocialResult) => c.productId.toString() == id.toString()
          );
          if (campaign.productId.toString() === id) {
            const { orderItemIds } = campaignResultByProductId;
            campaignSocialResultBulk.find({ _id: campaignResultByProductId._id }).updateOne({
              $set: { orderItemIds: [...orderItemIds, orderItem._id] },
            });
          }
        }
        // console.log('orderItem', orderItem);
        return orderItem;
      }
    );

    order.subtotal = sumBy(orderItems, "amount");
    order.amount = sumBy(orderItems, "amount") + VAT - DISCOUNT;
    order.itemCount = sumBy(orderItems, "qty");

    order.commission0 = sumBy(orderItems, "commission0");
    order.commission1 = sumBy(orderItems, "commission1");
    order.commission2 = sumBy(orderItems, "commission2");

    order.sellerBonusPoint = sumBy(orderItems, "sellerBonusPoint");
    order.buyerBonusPoint = sumBy(orderItems, "buyerBonusPoint");

    order.itemIds = orderItems.map((oi) => oi._id);

    // Save lại
    return await Promise.all([
      order.save(),
      OrderItemModel.insertMany(orderItems),
      campaign && campaignSocialResultBulk.execute(),
    ]).then((res) => {
      return res[0];
    });
  };

  updateLogToOrder = async ({ order, log }: { order: IOrder; log: IOrderLog }) => {
    const setData: any = {
      $push: { orderLogIds: log._id },
      loggedAt: log.createdAt,
    };
    switch (log.orderStatus) {
      case OrderStatus.COMPLETED:
      case OrderStatus.CANCELED:
      case OrderStatus.FAILURE:
        setData.finishedAt = log.createdAt;
    }
    await Promise.all([
      order.updateOne({ $set: setData }).exec(),
      OrderItemModel.updateMany(
        { orderId: order._id },
        { $set: { finishedAt: setData.finishedAt || order.finishedAt, status: log.orderStatus } }
      ).exec(),
    ]);
  };
}

const orderService = new OrderService();

export { orderService };
