import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../collaboratorProduct/collaboratorProduct.model";
import { IOrder, OrderModel } from "../../order/order.model";
import { IOrderItem } from "../../orderItem/orderItem.model";


export class MediaProductStats {
    unCompletedQty: number = 0;
    completedQty: number = 0;
    static loaders: { [x: string]: DataLoader<string, MediaProductStats> } = {};

    static getLoader(args: any) {
        const { fromDate, toDate } = args;

        const loaderId = fromDate + toDate;

        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

        if (!this.loaders[loaderId]) {
            this.loaders[loaderId] = new DataLoader<string, MediaProductStats>(
                async (ids) => {
                    const objectIds = ids.map(Types.ObjectId);
                    const orderMatch = {};

                    const $match: any = {};
                    set($match, "_id.$in", objectIds);

                    if ($gte) {
                        set(orderMatch, "createdAt.$gte", $gte);
                    }

                    if ($lte) {
                        set(orderMatch, "createdAt.$lte", $lte);
                    }

                    return await CollaboratorProductModel.aggregate([
                        {
                            $match
                        },
                        {
                            $lookup: {
                                from: "orders",
                                localField: "collaboratorId",
                                foreignField: "collaboratorId",
                                as: "order"
                            }
                        },
                        {
                            $unwind: "$order"
                        },
                        {
                            $match:{
                                ...orderMatch
                            }
                        },
                        {
                            $lookup: {
                                from: "orderitems",
                                localField: "order._id",
                                foreignField: "orderId",
                                as: "orderitem"
                            }
                        },
                        {
                            $unwind: "$orderitem"
                        },
                        {
                            $sort: {
                                _id: -1
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                productId: 1,
                                orderProductId: "$orderitem.productId",
                                orderProductQty: "$orderitem.qty",
                                orderId: "$order._id",
                                orderStatus: "$order.status"
                            }
                        }, {
                            $project: {
                                _id: 1,
                                productId: 1,
                                orderProductId: 1,
                                orderProductQty: 1,
                                orderId: 1,
                                orderStatus: 1,
                                equal: { $eq: [{ $toString: "$productId" }, { $toString: "$orderProductId" }] }
                            }
                        },
                        {
                            $match: { equal: true }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                unCompletedQty: { $sum: { $cond: [{ $in: ["$orderStatus", ["PENDING", "CONFIRMED", "DELIVERING"]] }, "$orderProductQty", 0] } },
                                completedQty: { $sum: { $cond: [{ $in: ["$orderStatus", ["COMPLETED"]] }, "$orderProductQty", 0] } },
                            }
                        }
                    ]).then((list) => {
                        const listKeyBy = keyBy(list, "_id");
                        return ids.map((id) =>
                            get(listKeyBy, id, new MediaProductStats())
                        );
                    });
                    return null;
                },
                { cache: false } // Bỏ cache
            );
        }
        return this.loaders[loaderId];
    }
}