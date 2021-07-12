import { gql } from "apollo-server-express";
import { get, set } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";
import { StaffModel } from "../staff/staff.model";

export default {
  schema: gql`
    extend type Query {
      reportShopOrder(filter: ReportShopOrderInput!): ReportShopOrderData
    }
    input ReportShopOrderInput {
      fromDate: String!
      toDate: String!
      shopBranchId: ID
    }
    type ReportShopOrderData {
      pending: Int
      confirmed: Int
      delivering: Int
      completed: Int
      canceled: Int
      failure: Int
      total: Int
      pendingRevenue: Float
      revenue: Float
    }
  `,
  resolver: {
    Query: {
      reportShopOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { fromDate, toDate, shopBranchId } = args.filter;
        const $match: any = {
          sellerId: Types.ObjectId(context.sellerId),
        };
        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
        if ($gte) set($match, "createdAt.$gte", $gte);
        if ($lte) set($match, "createdAt.$lte", $lte);
        if (shopBranchId) {
          set($match, "shopBranchId", Types.ObjectId(shopBranchId));
        } else if (context.isStaff()) {
          const staff = await StaffModel.findById(context.id);
          set($match, "shopBranchId", staff.branchId);
        }
        return OrderModel.aggregate([
          { $match },
          {
            $group: {
              _id: null,
              pending: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.PENDING] }, 1, 0] } },
              confirmed: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.CONFIRMED] }, 1, 0] } },
              delivering: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.DELIVERING] }, 1, 0] } },
              completed: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, 1, 0] } },
              canceled: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.CANCELED] }, 1, 0] } },
              failure: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.FAILURE] }, 1, 0] } },
              total: { $sum: 1 },
              pendingRevenue: {
                $sum: {
                  $cond: [
                    {
                      $in: [
                        "$status",
                        [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.DELIVERING],
                      ],
                    },
                    "$amount",
                    0,
                  ],
                },
              },
              revenue: {
                $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, "$amount", 0] },
              },
            },
          },
        ]).then((res) =>
          get(res, "0", {
            pending: 0,
            confirmed: 0,
            delivering: 0,
            completed: 0,
            canceled: 0,
            failure: 0,
            total: 0,
            pendingRevenue: 0,
            revenue: 0,
          })
        );
      },
    },
  },
};
