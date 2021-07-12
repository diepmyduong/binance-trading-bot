import { gql } from "apollo-server-express";
import { set } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderStatus } from "../order/order.model";
import { OrderItemModel } from "../orderItem/orderItem.model";

export default {
  schema: gql`
    extend type Query {
      reportShopProduct(filter: ReportShopProductInput!): ReportShopProductData
    }
    input ReportShopProductInput {
      fromDate: String!
      toDate: String!
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
        const { fromDate, toDate } = args.filter;
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
        if ($gte) set($match, "createdAt.$gte", $gte);
        if ($lte) set($match, "createdAt.$lte", $lte);
        return OrderItemModel.aggregate([
          { $match },
          {
            $group: {
              _id: "$productId",
              productId: { $first: "$productId" },
              productName: { $first: "$productName" },
              qty: { $sum: "$qty" },
            },
          },
          { $sort: { qty: -1 } },
          { $limit: 10 },
        ]).then((res) => ({ top10: res }));
      },
    },
  },
};
