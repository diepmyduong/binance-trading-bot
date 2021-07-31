import { gql } from "apollo-server-express";
import { set } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";
import { OrderItemModel } from "../orderItem/orderItem.model";

export default {
  schema: gql`
    extend type Query {
      reportShopProduct(filter: ReportShopProductInput!): ReportShopProductData
    }
    input ReportShopProductInput {
      fromDate: String!
      toDate: String!
      shopBranchId: ID
    }
    type ReportShopProductData {
      top10: [ProductOrder]
    }
    type ProductOrder {
      productId: ID
      qty: Int
      productName: String
    }
  `,
  resolver: {
    Query: {
      reportShopProduct: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { fromDate, toDate, shopBranchId } = args.filter;
        const $match: any = {
          sellerId: Types.ObjectId(context.sellerId),
          status: {
            $in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.DELIVERING,
              OrderStatus.COMPLETED,
            ],
          },
        };
        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
        if ($gte) set($match, "loggedAt.$gte", $gte);
        if ($lte) set($match, "loggedAt.$lte", $lte);
        if (shopBranchId) set($match, "shopBranchId", Types.ObjectId(shopBranchId));
        const query = [
          { $match },
          {
            $lookup: {
              from: "orderitems",
              localField: "itemIds",
              foreignField: "_id",
              as: "items",
            },
          },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.productId",
              productId: { $first: "$items.productId" },
              productName: { $first: "$items.productName" },
              qty: { $sum: "$items.qty" },
            },
          },
          { $sort: { qty: -1 } },
          { $limit: 10 },
        ];
        // console.log("query", JSON.stringify(query, null, 2));
        return OrderModel.aggregate(query).then((res) => ({ top10: res }));
      },
    },
  },
};
