import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../collaboratorProduct/collaboratorProduct.model";
import { IOrder, OrderModel } from "../../order/order.model";
import { IOrderItem } from "../../orderItem/orderItem.model";

export class MediaCollaboratorStats {
    productsViewCount: number = 0;
    productsLikeCount: number = 0;
    productsShareCount: number = 0;
    productsCommentCount: number = 0;
    productLinksCount: number = 0;

    static loaders: { [x: string]: DataLoader<string, MediaCollaboratorStats> } = {};

    static getLoader(args: any) {
        const { fromDate, toDate } = args;

        const loaderId = fromDate + toDate;

        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

        if (!this.loaders[loaderId]) {
            this.loaders[loaderId] = new DataLoader<string, MediaCollaboratorStats>(
                async (ids) => {
                    //collaborator
                    const objectIds = ids.map(Types.ObjectId);

                    const $match: any = {};
                    set($match, "_id.$in", objectIds);

                    // if ($gte) {
                    //     set(orderMatch, "createdAt.$gte", $gte);
                    // }

                    // if ($lte) {
                    //     set(orderMatch, "createdAt.$lte", $lte);
                    // }

                    // console.log('$match', $match);

                    return await CollaboratorModel.aggregate([
                        {
                            $match
                        },
                        {
                            $lookup: {
                                from: "collaboratorproducts",
                                localField: "_id",
                                foreignField: "collaboratorId",
                                as: "collaboratorproducts"
                            }
                        },
                        {
                            $unwind: "$collaboratorproducts"
                        },
                        {
                            $group: {
                                _id: "$_id",
                                productLinksCount: { $sum: 1 },
                                productsViewCount: { $sum: "$collaboratorproducts.clickCount" },
                                productsLikeCount:{ $sum: "$collaboratorproducts.likeCount" },
                                productsShareCount: { $sum: "$collaboratorproducts.shareCount" },
                                productsCommentCount: { $sum: "$collaboratorproducts.commentCount" },
                            }
                        },
                    ]).then(list=>{
                        let listKeyBy = keyBy(list, "_id");
                        return ids.map((id) => {
                            return get(listKeyBy, id, new MediaCollaboratorStats())
                        })
                    })
                },
                { cache: false } // Bỏ cache
            );
        }
        return this.loaders[loaderId];
    }
}