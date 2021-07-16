import { gql } from "apollo-server-express";
import { get, keyBy, set } from "lodash";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { configs } from "../../../configs";
import { ROLES } from "../../../constants/role.const";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";
import { StaffModel } from "../staff/staff.model";

export default {
  schema: gql`
    extend type Query {
      reportShopOrder(filter: ReportShopOrderInput!): ReportShopOrderData
      reportShopOrderKline(filter: ReportShopOrderInput!): KlineData
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
      partnerShipfee: Float
      shipfee: Float
    }
    type KlineData {
      labels: [String]
      datasets: [DataSet]
    }
    type DataSet {
      label: String
      data: [Float]
    }
  `,
  resolver: {
    Query: {
      reportShopOrder: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { fromDate, toDate, shopBranchId } = args.filter;
        const $match: any = await getMatch(context, fromDate, toDate, shopBranchId);
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
              partnerShipfee: {
                $sum: {
                  $cond: [
                    {
                      $in: [
                        "$status",
                        [OrderStatus.FAILURE, OrderStatus.COMPLETED, OrderStatus.DELIVERING],
                      ],
                    },
                    "$deliveryInfo.partnerFee",
                    0,
                  ],
                },
              },
              shipfee: {
                $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, "$shipfee", 0] },
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
            partnerShipfee: 0,
            shipfee: 0,
          })
        );
      },
      reportShopOrderKline: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        const { fromDate, toDate, shopBranchId } = args.filter;
        if (-moment(fromDate).diff(toDate, "days") > 62)
          throw Error("Chỉ giới hạn dữ liệu trong 2 tháng");
        const $match: any = await getMatch(context, fromDate, toDate, shopBranchId);
        const data = await OrderModel.aggregate([
          { $match },
          {
            $addFields: {
              date: {
                $dateToString: { date: "$createdAt", timezone: configs.timezone, format: "%dT%m" },
              },
            },
          },
          {
            $group: {
              _id: "$date",
              total: { $sum: 1 },
              revenue: {
                $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, "$amount", 0] },
              },
            },
          },
        ]).then((res) => keyBy(res, "_id"));
        const kline: any = {
          labels: [],
          datasets: [
            { label: "Đơn hàng", data: [] },
            { label: "Doanh thu", data: [] },
          ],
        };
        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
        const date = moment($gte);
        while (date.isBefore($lte)) {
          const label = date.format("DDTMM");
          kline.labels.push(label);
          const record = data[label];
          kline.datasets[0].data.push(record ? record.total : 0);
          kline.datasets[1].data.push(record ? record.revenue : 0);
          date.add(1, "days");
        }
        return kline;
      },
    },
  },
};
async function getMatch(context: Context, fromDate: any, toDate: any, shopBranchId: any) {
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
  return $match;
}
