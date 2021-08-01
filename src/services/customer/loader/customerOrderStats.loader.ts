import DataLoader from "dataloader";
import { keyBy, get } from "lodash";
import { Types } from "mongoose";
import { CustomerModel } from "../../../graphql/modules/customer/customer.model";
import { OrderModel, OrderStatus } from "../../../graphql/modules/order/order.model";
import { ttlCache } from "../../../helpers/ttlCache";

type CustomerOrderStats = {
  revenue: number; // Tổng doanh số
  voucher: number; // Tổng số lượng voucher sử dụng
  discount: number; // Tổng giảm giáoat
  total: number; // Tổng đơn hàng
  completed: number; // Tỏng đơn huỷ Int
  canceled: number; // Tổng đơn huỷ
};

export const CustomerOrderStatsLoader = new DataLoader<String, CustomerOrderStats>(
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
    ])
      .then((list) => {
        const bulk = CustomerModel.collection.initializeUnorderedBulkOp();
        list.forEach((l) => {
          bulk.find({ _id: Types.ObjectId(l._id) }).updateOne({
            $set: {
              "context.order": l.total,
              "context.completed": l.completed,
              "context.canceled": l.canceled,
              "context.revenue": l.revenue,
              "context.discount": l.discount,
              "context.voucher": l.voucher,
            },
          });
        });
        if (bulk.length > 0) {
          bulk
            .execute()
            .catch((err) => {})
            .then(() => {
              console.log("CustomerOrderStatsLoader", bulk.length);
            });
        }
        return list;
      })
      .then((list) => {
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
  { cache: true, cacheMap: ttlCache({ ttl: 30000, maxSize: 100 }) }
);
