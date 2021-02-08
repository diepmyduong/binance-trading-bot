import DataLoader from "dataloader";
import { get } from "lodash";
import { keyBy } from "lodash";
import { Types } from "mongoose";
import { CampaignSocialResultModel } from "../campaignSocialResult.model";

export class CampaignRegisServiceStats {
  total?: number = 0;
  completed?: number = 0;
  canceled?: number = 0;
  pending?: number = 0;
  static loaders: {
    [x: string]: DataLoader<string, CampaignRegisServiceStats>;
  } = {};
  static getLoader(id: string) {
    if (!this.loaders[id]) {
      this.loaders[id] = new DataLoader<string, CampaignRegisServiceStats>(
        async (ids) => {
          console.log("id", id);
          return await CampaignSocialResultModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
              $lookup: {
                from: "regisservices",
                localField: "campaignId",
                foreignField: "campaignId",
                as: "regisservices",
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
                regisservices: 1,
                completedregisservices: {
                  $filter: {
                    input: "$regisservices",
                    as: "regisservice",
                    cond: { $eq: ["$$regisservice.status", "COMPLETED"] },
                  },
                },
                pendingregisservices: {
                  $filter: {
                    input: "$regisservices",
                    as: "regisservice",
                    cond: { $eq: ["$$regisservice.status", "PENDING"] },
                  },
                },
                canceledregisservices: {
                  $filter: {
                    input: "$regisservices",
                    as: "regisservice",
                    cond: { $eq: ["$$regisservice.status", "CANCELED"] },
                  },
                },
              },
            },

            {
              $project: {
                _id: 1,
                total: { $size: "$regisservices" },
                completed: { $size: "$completedregisservices" },
                canceled: { $size: "$canceledregisservices" },
                pending: { $size: "$pendingregisservices" },
              },
            },
          ]).then((list) => {
            console.log("list", list);
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new CampaignRegisServiceStats())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[id];
  }
}
