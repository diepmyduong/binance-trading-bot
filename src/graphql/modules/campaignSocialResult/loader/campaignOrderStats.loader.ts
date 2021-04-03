import DataLoader from "dataloader";
import { get } from "lodash";
import { keyBy } from "lodash";
import { Types } from "mongoose";
import { CampaignSocialResultModel } from "../campaignSocialResult.model";

export class CampaignOrderStats {
  total?: number = 0;
  completed?: number = 0;
  canceled?: number = 0;
  pending?: number = 0;
  static loaders: { [x: string]: DataLoader<string, CampaignOrderStats> } = {};
  static getLoader(id: string) {
    if (!this.loaders[id]) {
      this.loaders[id] = new DataLoader<string, CampaignOrderStats>(
        async (ids) => {
          // console.log("id", id);
          return await CampaignSocialResultModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
              $lookup: {
                from: "orderitems",
                localField: "campaignId",
                foreignField: "campaignId",
                as: "orderitems",
              },
            },
            {
              $sort: {
                _id: -1,
              },
            },
            {
              $project: {
                _id: 1,
                orderitems: 1,
                completedorderitems: {
                  $filter: {
                    input: "$orderitems",
                    as: "orderitem",
                    cond: { $eq: ["$$orderitem.status", "COMPLETED"] },
                  },
                },
                pendingorderitems: {
                  $filter: {
                    input: "$orderitems",
                    as: "orderitem",
                    cond: { $eq: ["$$orderitem.status", "PENDING"] },
                  },
                },
                canceledorderitems: {
                  $filter: {
                    input: "$orderitems",
                    as: "orderitem",
                    cond: { $eq: ["$$orderitem.status", "CANCELED"] },
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                total: { $size: "$orderitems" },
                completed: { $size: "$completedorderitems" },
                canceled: { $size: "$canceledorderitems" },
                pending: { $size: "$pendingorderitems" },
              },
            },
          ]).then((list) => {
            console.log("list", list);
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new CampaignOrderStats())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[id];
  }
}
