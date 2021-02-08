import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader } from "../customer/customer.model";
import { MemberLoader } from "../member/member.model";
import { OrderItemLoader } from "../orderItem/orderItem.model";
import { UserLoader } from "../user/user.model";
import { IProduct, ProductModel, ProductType } from "../product/product.model";
import { orderService } from "./order.service";
import { ErrorHelper } from "../../../base/error";
import { onOrderTestSendMess } from "../../../events/onOrderTestSendMess.event";
import { onOrderedProduct } from "../../../events/onOrderedProduct.event";
import { CampaignLoader, CampaignModel } from "../campaign/campaign.model";
// import { CustomerModel } from "../customer/customer.model";
// import { CrossSaleModel } from "../crossSale/crossSale.model";
// import { crossSaleService } from "../crossSale/crossSale.service";

const Query = {
  // neu la admin
  getAllOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);

    // neu la sellerId
    if (context.isMember()) {
      set(args, "q.filter.sellerId", context.id);
    }

    // neu la buyer id
    if (context.isCustomer()) {
      set(args, "q.filter.buyerId", context.id);
    }

    //ne
    return orderService.fetch(args.q);
  },
  getOneOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await orderService.findOne({ _id: id });
  },
};

const Mutation = {
  createOrder: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { campaignCode, sellerId, id: buyerId } = context;

    // const buyerId = "5fcf41dc03810d27729155b8";
    // const memberId = '5fcf40888d4eab78cd705585';
    // console.log('memberId', memberId);
    // console.log('buyerId', buyerId);

    const { data } = args;
    const {
      items,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      commission0,
      commission1,
      commission2,
    } = data;

    // kiểm tra danh sách
    const itemsLength = Object.keys(items).length;
    if (itemsLength === 0)
      throw ErrorHelper.requestDataInvalid("Danh sách sản phẩm");

    const itemIDs = items.map((i: any) => i.productId);
    console.log("itemIDs", itemIDs);
    //Lấy ra product + memberId
    const allProducts = await ProductModel.find({
      _id: { $in: itemIDs },
      type: ProductType.RETAIL,
      allowSale: true,
    });

    // console.log('allProducts', allProducts);
    const productsLength = Object.keys(allProducts).length;

    // console.log('productsLength', productsLength);
    // console.log('itemsLength', itemsLength);
    if (productsLength !== itemsLength)
      throw ErrorHelper.mgQueryFailed("Danh sách sản phẩm");

    // return [];
    const initOrder: any = {
      buyerId,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      commission0,
      commission1,
      commission2,
    };

    // console.log('campaignCode', campaignCode);

    const campaign = await CampaignModel.findOne({ code: campaignCode });

    const addQuantitytoProduct = (product: any) => {
      product.qty = items.find((p: any) => p.productId === product.id).quantity;
      // console.log('product', product.qty);
      return product;
    };

    // xu ly crossSale Items
    const mobifoneProducts: any = allProducts
      .filter((p) => p.isPrimary === true)
      .map(addQuantitytoProduct);
    // console.log('mobifoneProducts', mobifoneProducts);

    const directShoppingProducts: any = allProducts
      .filter(
        (p) =>
          p.isPrimary === false &&
          p.memberId == sellerId &&
          p.isCrossSale === false
      )
      .map(addQuantitytoProduct);
    // console.log('directShoppingProducts', directShoppingProducts);

    const crossSaleProducts = allProducts
      .filter((p) => p.isPrimary === false && p.isCrossSale === true)
      .map(addQuantitytoProduct);

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

    // return [];

    const mobiOrder = orderService.createMobiOrder(
      mobifoneProducts,
      sellerId,
      initOrder
    );
    const shopOrder = orderService.createOrder(
      directShoppingProducts,
      sellerId,
      initOrder
    );
    const crossSaleOrders = await orderService.createCrossSaleOrders(
      crossSaleProducts,
      sellerId,
      initOrder
    );

    // console.log('mobiOrders', mobiOrder);
    // console.log('shopOrders', shopOrder);
    // console.log('crossSaleOrders', crossSaleOrders);

    if (!mobiOrder && !shopOrder && !crossSaleOrders) {
      throw ErrorHelper.mgRecoredNotFound("sản phẩm trong shop");
    }

    if (crossSaleOrders) {
      if (crossSaleOrders.length === 0)
        throw ErrorHelper.mgRecoredNotFound("sản phẩm bán chéo trong shop");
    }

    let orderResults: any = [];
    let mobiOrderResult = null;
    let orderResult = null;

    if (mobiOrder) {
      mobiOrderResult = await orderService.insertMobifoneOrder(
        mobiOrder,
        campaign
      );
      orderResults.push(mobiOrderResult);
    }

    if (shopOrder) {
      orderResult = await orderService.insertOrder(shopOrder);
      orderResults.push(orderResult);
    }

    if (crossSaleOrders) {
      for (const order of crossSaleOrders) {
        // console.log('order', order);
        const crossSaleOrderResult = await orderService.insertOrder(order);
        orderResults.push(crossSaleOrderResult);
      }
    }

    for (const order of orderResults) {
      onOrderedProduct.next(order);
    }

    return orderResults;
  },
};

const Order = {
  items: GraphQLHelper.loadManyById(OrderItemLoader, "itemIds"),
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  fromMember: GraphQLHelper.loadById(MemberLoader, "fromMemberId"),
  updatedByUser: GraphQLHelper.loadById(UserLoader, "updatedByUserId"),
  buyer: GraphQLHelper.loadById(CustomerLoader, "buyerId"),
};

export default {
  Query,
  Mutation,
  Order,
};
