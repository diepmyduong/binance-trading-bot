import DataLoader from "dataloader";
import { get } from "lodash";
import { keyBy } from "lodash";
import { Types } from "mongoose";
import { CampaignSocialResultModel } from "../campaignSocialResult.model";

export class CampaignRegisSMSStats {
  total?: number = 0;
  completed?: number = 0;
  canceled?: number = 0;
  pending?: number = 0;
  static loaders: {
    [x: string]: DataLoader<string, CampaignRegisSMSStats>;
  } = {};
  static getLoader(id: string) {
    if (!this.loaders[id]) {
      this.loaders[id] = new DataLoader<string, CampaignRegisSMSStats>(
        async (ids) => {
          console.log("id", id);
          return await CampaignSocialResultModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
              $lookup: {
                from: "regissms",
                localField: "campaignId",
                foreignField: "campaignId",
                as: "regissmss",
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
                regissmss: 1,
                completedregissmss: {
                  $filter: {
                    input: "$regissmss",
                    as: "regissms",
                    cond: { $eq: ["$$regissms.status", "COMPLETED"] },
                  },
                },
                pendingregissmss: {
                  $filter: {
                    input: "$regissmss",
                    as: "regissms",
                    cond: { $eq: ["$$regissms.status", "PENDING"] },
                  },
                },
                canceledregissmss: {
                  $filter: {
                    input: "$regissmss",
                    as: "regissms",
                    cond: { $eq: ["$$regissms.status", "CANCELED"] },
                  },
                },
              },
            },

            {
              $project: {
                _id: 1,
                total: { $size: "$regissmss" },
                completed: { $size: "$completedregissmss" },
                canceled: { $size: "$canceledregissmss" },
                pending: { $size: "$pendingregissmss" },
              },
            },
          ]).then((list) => {
            console.log("list", list);
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new CampaignRegisSMSStats())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[id];
  }
}
