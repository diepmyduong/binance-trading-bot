import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { set } from "lodash";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { productService } from "../../product/product.service";
import { ProductStats } from "../loaders/productStats.loader";
import { IProduct, ProductModel } from "../../product/product.model";
import { OrderItemModel } from "../../orderItem/orderItem.model";

const getProductReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate, sellerIds } = args;

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const $match = {};

  if ($gte) {
    set($match, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set($match, "createdAt.$lte", $lte);
  }

  const orderItems: any = await OrderItemModel.aggregate([
    {
      $match
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order'
      }
    },
    { $unwind: '$order' },
    {
      $project: {
        _id: 1,
        status: 1,
        productId: 1,
        productName: 1,
        basePrice: 1,
        orderId: 1,
        sellerId: "$order.sellerId",
        amount: 1,
        qty: 1,
        commission1: 1,
        commission2: 1,
        commission3: 1
      }
    },
    {
      $group: {
        _id: { productId: "$productId", productName: "$productName", basePrice: "$basePrice" },
        completedQtyCount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$qty", 0] } },
        completedAmount: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0] } },
        completedCommission: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, { $sum: ["$commission1", "$commission2", "$commission3"] }, 0] } },
      }
    },
    {
      $project: {
        _id: 1,
        productId: "$_id.productId",
        productName: "$_id.productName",
        basePrice: "$_id.basePrice",
        completedQtyCount: 1,
        completedAmount: 1,
        completedCommission: 1
      }
    },
  ]);

  const mostInterestedProducts: any = orderItems.sort((o1: any, o2: any) => {
    return o2.completedQtyCount - o1.completedQtyCount;
  }).slice(0, 5).map(({ productName, completedQtyCount }: any) => ({
    name: productName,
    value: completedQtyCount,
    unit: "Sản phẩm"
  }));

  const mostIncomeProducts = orderItems.sort((o1: any, o2: any) => {
    return o2.completedAmount - o1.completedAmount;
  }).slice(0, 5).map(({ productName, completedAmount }: any) => ({
    name: productName,
    value: completedAmount,
    unit: "VND"
  }));

  const mostCommissionProducts = orderItems.sort((o1: any, o2: any) => {
    return o2.completedCommission - o1.completedCommission;
  }).slice(0, 5).map(({ productName, completedCommission }: any) => ({
    name: productName,
    value: completedCommission,
    unit: "VND"
  }));

  const products = await ProductModel.find({ allowSale: true }, { _id: 1, name: 1, viewCount: 1 }).sort({ viewCount: -1 }).limit(5);

  const mostViewProducts = products.map(({ name, viewCount }: any) => ({
    name: name,
    value: viewCount,
    unit: "Lượt xem"
  }));

  return {
    mostInterestedProducts,
    mostIncomeProducts,
    mostCommissionProducts,
    mostViewProducts
  }
};

const getProductReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  return productService.fetch(args.q);
};

const OverviewProduct = {
  productStats: async (root: IProduct, args: any, context: Context) => {
    const { memberIds } = args;

    if (context.isMember()) {
      set(args, "sellerId.$in", [new ObjectId(context.id)]);
    }
    else {
      if (memberIds) {
        if (memberIds.length > 0) {
          set(args, "sellerId.$in", memberIds.map(Types.ObjectId));
        }
      }
    }

    return ProductStats.getLoader(args).load(root.id);
  },
}

const Query = {
  getProductReportsOverview,
  getProductReports
};

export default {
  Query,
  OverviewProduct
};
