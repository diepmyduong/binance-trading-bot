import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { get, keyBy, set } from "lodash";
import { Types } from "mongoose";
import { UtilsHelper } from "../../../helpers";
import { Context } from "../../context";
import { CustomerCommissionLogModel } from "../customerCommissionLog/customerCommissionLog.model";
import { ICollaborator } from "./collaborator.model";

export default {
  schema: gql`
    extend type Collaborator {
      commissionStats(fromDate: String, toDate: String): CollaboratorCommissionStats
    }
    type CollaboratorCommissionStats {
      commission: Float
    }
  `,
  resolver: {
    Collaborator: {
      commissionStats: async (root: ICollaborator, args: any, context: Context) => {
        const { fromDate, toDate } = args;
        return getLoader(fromDate, toDate).load(root._id.toString());
      },
    },
  },
};

const loaders = new Map<string, DataLoader<string, any>>();

const getLoader = (fromDate: string, toDate: string) => {
  const hash = fromDate + toDate;
  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);
  if (!loaders.has(hash)) {
    loaders.set(
      hash,
      new DataLoader<string, any>(
        async (ids) => {
          const objectIds = ids.map(Types.ObjectId);

          const $match: any = {};
          if ($gte) set($match, "createdAt.$gte", $gte);
          if ($lte) set($match, "createdAt.$lte", $lte);
          set($match, "collaboratorId.$in", objectIds);
          const query = [
            { $match: $match },
            {
              $group: {
                _id: "$collaboratorId",
                commission: { $sum: "$value" },
              },
            },
          ];
          return await CustomerCommissionLogModel.aggregate(query).then((list) => {
            const listKeyBy = keyBy(list, "_id");
            return ids.map((id) => get(listKeyBy, id, { commission: 0 }));
          });
        },
        { cache: false } // Bỏ cache
      )
    );
  }
  return loaders.get(hash);
};
