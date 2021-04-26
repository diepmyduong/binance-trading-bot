import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";
import { CollaboratorModel } from "../../collaborator/collaborator.model";

export class AllMediaProductsStats {
    unCompletedProductsCount: number = 0;
    unCompletedProductsQty: number = 0;
    completedProductsCount: number = 0;
    completedProductsQty: number = 0;

    static loaders: { [x: string]: DataLoader<string, AllMediaProductsStats> } = {};

    static getLoader(args: any) {
        const { fromDate, toDate } = args;

        const loaderId = fromDate + toDate;

        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

        if (!this.loaders[loaderId]) {
            this.loaders[loaderId] = new DataLoader<string, AllMediaProductsStats>(
                async (ids) => {
                    //collaborator
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

                    return await CollaboratorModel.aggregate([
                        {
                            $match
                        },
                        {
                            $lookup:{
                                from: "orders",
                                localField:"_id",
                                foreignField:"collaboratorId",
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
                            $lookup:{
                                from: "orderitems",
                                localField:"order._id",
                                foreignField:"orderId",
                                as: "orderitem"
                            }
                        },
                        {
                            $unwind: "$orderitem"
                        },
                        {
                          $group: {
                            _id: "$_id",
                            unCompletedProductsCount: { $sum: { $cond:[{ $in: ["$orderitem.status", ["PENDING","CONFIRMED", "DELIVERING"]] }, 1, 0] }},
                            unCompletedProductsQty: { $sum: { $cond:[{ $in: ["$orderitem.status", ["PENDING","CONFIRMED", "DELIVERING"]] }, "$orderitem.qty", 0] }},
                            completedProductsCount: { $sum: { $cond:[{ $eq: ["$orderitem.status", "COMPLETED"] }, 1, 0] }},
                            completedProductsQty: { $sum: { $cond:[{ $eq: ["$orderitem.status", "COMPLETED"] }, "$orderitem.qty", 0] } },
                           }
                          },          
                        ]).then(list=>{
                        let listKeyBy = keyBy(list, "_id");
                        return ids.map((id) => {
                            return get(listKeyBy, id, new AllMediaProductsStats())
                        })
                    })
                },
                { cache: false } // Bỏ cache
            );
        }
        return this.loaders[loaderId];
    }
}