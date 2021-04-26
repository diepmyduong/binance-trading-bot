import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../../helpers";
import { CollaboratorModel } from "../../collaborator/collaborator.model";
import { CollaboratorProductModel } from "../../collaboratorProduct/collaboratorProduct.model";
import { IOrder, OrderModel } from "../../order/order.model";
import { IOrderItem } from "../../orderItem/orderItem.model";


export class MediaProductStats {
    unCompletedCount: number = 0;
    completedCount: number = 0;
    static loaders: { [x: string]: DataLoader<string, MediaProductStats> } = {};

    static getLoader(args: any) {
        const { fromDate, toDate } = args;

        const loaderId = fromDate + toDate;

        const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

        if (!this.loaders[loaderId]) {
            this.loaders[loaderId] = new DataLoader<string, MediaProductStats>(
                async (ids) => {
                    const objectIds = ids.map(Types.ObjectId);

                    //       const $match: any = {};

                    //       if ($gte) {
                    //         set($match, "createdAt.$gte", $gte);
                    //       }

                    //       if ($lte) {
                    //         set($match, "createdAt.$lte", $lte);
                    //       }

                    //       set($match, "memberId.$in", objectIds);

                    //       return await CollaboratorModel.aggregate([
                    //         {
                    //           $match,
                    //         },
                    //         {
                    //           $group: {
                    //             _id: "$memberId",
                    //             collaboratorsCount: { $sum: 1 },
                    //             customersAsCollaboratorCount: { $sum: { $cond: [{ $not: ["$customerId"] }, 0, 1] } }
                    //           }
                    //         }
                    //       ]).then((list) => {
                    //         const listKeyBy = keyBy(list, "_id");
                    //         return ids.map((id) =>
                    //           get(listKeyBy, id, new CollaboratorStats())
                    //         );
                    //       });
                    return null;
                },
                { cache: false } // Bỏ cache
            );
        }
        return this.loaders[loaderId];
    }
}