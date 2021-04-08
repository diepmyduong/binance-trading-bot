import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { CollaboratorModel } from "../../collaborator/collaborator.model";


export class CollaboratorStats {
  collaboratorsCount: number = 0;
  customersAsCollaboratorCount: number = 0;
  static loaders: { [x: string]: DataLoader<string, CollaboratorStats> } = {};

  static getLoader(fromDate: string, toDate: string) {
    const loaderId = fromDate + toDate;
    let $gte: Date = null,
      $lte: Date = null;

    if (fromDate) {
      fromDate = fromDate + "T00:00:00+07:00";
      $gte = new Date(fromDate);
    }

    if (toDate) {
      toDate = toDate + "T00:00:00+07:00";
      $lte = new Date(toDate);
    }

    if (!this.loaders[loaderId]) {
      this.loaders[loaderId] = new DataLoader<string, CollaboratorStats>(
        async (ids) => {
          const objectIds = ids.map(Types.ObjectId);

          return await CollaboratorModel.aggregate([
            {
              $match: {
                memberId: { $in: objectIds },
                createdAt: {
                  $lte
                },
              }
            },
            {
              $group: {
                _id: "$memberId",
                collaboratorsCount: { $sum: 1 },
                customersAsCollaboratorCount: { $sum: { $cond: [{ $ne: ["$customerId", undefined] }, 1, 0] } }
              }
            }
          ]).then((list) => {
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) =>
              get(listKeyBy, id, new CollaboratorStats())
            );
          });
        },
        { cache: false } // Bỏ cache
      );
    }
    return this.loaders[loaderId];
  }
}