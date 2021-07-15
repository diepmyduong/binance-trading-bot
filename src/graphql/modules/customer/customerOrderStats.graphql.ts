import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { Context } from "../../context";
import { OrderModel, OrderStatus } from "../order/order.model";
import { ICustomer } from "./customer.model";

export default {
  schema: gql`
    extend type Customer {
      orderStats: CustomerOrderStats
    }
    type CustomerOrderStats {
      "Tổng doanh số"
      revenue: Float
      "Tổng số lượng voucher sử dụng"
      voucher: Int
      "Tổng giảm giá"
      discount: Float
      "Tổng đơn hàng"
      total: Int
      "Tỏng đơn huỷ"
      completed: Int
      "Tổng đơn huỷ"
      canceled: Int
    }
  `,
  resolver: {
    Customer: {
      orderStats: async (root: ICustomer, args: any, context: Context) => {
        return CustomerOrderStatsLoader.load(root.id);
      },
    },
  },
};

type CustomerOrderStats = {
  revenue: number; // Tổng doanh số
  voucher: number; // Tổng số lượng voucher sử dụng
  discount: number; // Tổng giảm giáoat
  total: number; // Tổng đơn hàng
  completed: number; // Tỏng đơn huỷ Int
  canceled: number; // Tổng đơn huỷ
};

const CustomerOrderStatsLoader = new DataLoader<String, CustomerOrderStats>(
  (ids: string[]) => {
    const objectIds = ids.map(Types.ObjectId);
    return OrderModel.aggregate([
      { $match: { buyerId: { $in: objectIds } } },
      {
        $group: {
          _id: "$buyerId",
          completed: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, 1, 0] } },
          canceled: { $sum: { $cond: [{ $eq: ["$status", OrderStatus.CANCELED] }, 1, 0] } },
          total: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $eq: ["$status", OrderStatus.COMPLETED] }, "$amount", 0] },
          },
          discount: { $sum: "$discount" },
          voucher: { $sum: { $cond: [{ $not: ["$voucherId"] }, 0, 1] } },
        },
      },
    ]).then((list) => {
      const listKeyBy = keyBy(list, "_id");
      return ids.map((id) =>
        get(listKeyBy, id, {
          revenue: 0,
          voucher: 0,
          discount: 0,
          total: 0,
          completed: 0,
          canceled: 0,
        })
      );
    });
  },
  { cache: false }
);
