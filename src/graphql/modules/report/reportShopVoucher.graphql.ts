import { gql } from "apollo-server-express";
import { set } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";

export default {
  schema: gql`
    extend type Query {
      reportShopVoucher(filter: ReportShopVoucherInput!): ReportShopVoucherData
    }
    input ReportShopVoucherInput {
      fromDate: String!
      toDate: String!
      shopBranchId: ID
    }
    type ReportShopVoucherData {
      top10: [VoucherOrder]
    }
    type VoucherOrder {
      voucherId: ID
      qty: Int
      discount: Float
      voucher: ShopVoucher
    }
  `,
  resolver: {
    Query: {
      reportShopVoucher: async (root: any, args: any, context: Context) => {
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
          voucherId: { $exists: true },
        };
        if (shopBranchId) set($match, "shopBranchId", Types.ObjectId(shopBranchId));
        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
        if ($gte) set($match, "loggedAt.$gte", $gte);
        if ($lte) set($match, "loggedAt.$lte", $lte);
        return OrderModel.aggregate([
          { $match },
          { $group: { _id: "$voucherId", qty: { $sum: 1 }, discount: { $sum: "$discount" } } },
          { $sort: { qty: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "shopvouchers",
              localField: "_id",
              foreignField: "_id",
              as: "voucher",
            },
          },
          { $unwind: "$voucher" },
        ]).then((res) => ({
          top10: res.map((res) => {
            res.voucherId = res._id;
            return res;
          }),
        }));
      },
    },
  },
};
