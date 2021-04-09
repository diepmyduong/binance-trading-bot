import { OrderLogModel } from "../../orderLog/orderLog.model";
import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";


export class MemberStatistics {
  customersCount: number = 0;
  collaboratorsCount: number = 0;
  customersAsCollaboratorCount: number = 0;
  ordersCount: number = 0;
  pendingCount: number = 0;
  confirmedCount: number = 0;
  deliveringCount: number = 0;
  completedCount: number = 0;
  failureCount: number = 0;
  canceledCount: number = 0;
  estimatedCommission: number = 0;
  realCommission: number = 0;
  estimatedIncome: number = 0;
  income: number = 0;
  static loaders: { [x: string]: DataLoader<string, MemberStatistics> } = {};

  static getLoader(fromDate: string, toDate: string) {
    const loaderId = fromDate + toDate;

    const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

    if (!this.loaders[loaderId]) {
      this.loaders[loaderId] = new DataLoader<string, MemberStatistics>(
        async (ids) => {
          const objectIds = ids.map(Types.ObjectId);
          
          return await OrderLogModel.aggregate([
            {
              $match: {
                memberId: { $in: objectIds },
                createdAt: {
                  $gte, 
                  $lte,
                },
              }
            },
            {
              $group: {
                _id: "$orderId",
                memberId: { $first: "$memberId" },
                log: { $last: "$$ROOT" }
              }
            },
            {
              $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: '_id',
                as: 'order'
              }
            },
            { $unwind: '$order' },
            {
              $group: {
                _id: "$memberId",
                ordersCount: { $sum: 1 },
                pendingCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, 1, 0] } },
                confirmedCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, 1, 0] } },
                completedCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, 1, 0] } },
                deliveringCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, 1, 0] } },
                canceledCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, 1, 0] } },
                failureCount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, 1, 0] } },
      
                pendingAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, "$order.amount", 0] } },
                confirmedAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, "$order.amount", 0] } },
                deliveringAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, "$order.amount", 0] } },
                canceledAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, "$order.amount", 0] } },
                failureAmount: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, "$order.amount", 0] } },
                estimatedIncome: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, "$order.amount"] } },
                income: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, "$order.amount", 0] } },
      
                pendingCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "PENDING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
                confirmedCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CONFIRMED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
                deliveringCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "DELIVERING"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
                canceledCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "CANCELED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
                failureCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "FAILURE"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
                estimatedCommission: { $sum: { $cond: [{ $in: ["$log.orderStatus", ["CANCELED", "FAILURE", "COMPLETED"]] }, 0, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }] } },
                realCommission: { $sum: { $cond: [{ $eq: ["$log.orderStatus", "COMPLETED"] }, { $sum: ["$order.commission1", "$order.commission2", "$order.commission3"] }, 0] } },
              }
            },
          ]).then((list) => {
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new MemberStatistics())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[loaderId];
  }
}