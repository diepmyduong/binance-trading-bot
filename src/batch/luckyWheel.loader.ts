import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { LuckyWheelModel } from "../graphql/modules/luckyWheel/luckyWheel.model";
import { LuckyWheelResultModel } from "../graphql/modules/luckyWheelResult/luckyWheelResult.model";

class LuckyWheelLoader {
  public issuedToDate = new DataLoader<string, number>(
    (ids: string[]) => {
      const objectIds = ids.map(Types.ObjectId);
      return LuckyWheelResultModel.aggregate([
        {
          $match: {
            luckyWheelId: { $in: objectIds },
            createdAt: {
              $gte: moment().startOf("days").toDate(),
              $lte: moment().endOf("days").toDate(),
            },
          },
        },
        {
          $group: {
            _id: "$luckyWheelId",
            count: { $sum: 1 },
          },
        },
      ])
        .then((list) => {
          const bulk = LuckyWheelModel.collection.initializeUnorderedBulkOp();
          list.forEach((l) => {
            bulk.find({ _id: Types.ObjectId(l._id) }).updateOne({
              $set: {
                issuedByDate: l.count,
                issuedDate: new Date(),
              },
            });
          });
          if (bulk.length > 0) {
            bulk.execute().catch((err) => {});
          }
          return list;
        })
        .then((list) => {
          const keyByIds = keyBy(list, "_id");
          return ids.map((id) => get(keyByIds, id + ".count", 0));
        });
    },
    { cache: false }
  );
  public issuedToDateByCustomer = new DataLoader<string, number>(
    (ids: string[]) => {
      const splits = ids.map((id) => id.split("|"));
      const wheelIds = splits.map((l) => Types.ObjectId(l[0]));
      const customerIds = splits.map((l) => Types.ObjectId(l[1]));
      return LuckyWheelResultModel.aggregate([
        {
          $match: {
            luckyWheelId: { $in: wheelIds },
            customerId: { $in: customerIds },
            createdAt: {
              $gte: moment().startOf("days").toDate(),
              $lte: moment().endOf("days").toDate(),
            },
          },
        },
        {
          $group: {
            _id: { wId: "$luckyWheelId", cId: "$customerId" },
            count: { $sum: 1 },
          },
        },
      ]).then((list) => {
        const keyByIds = keyBy(
          list.map((l) => {
            l.id = [l._id.wId, l._id.cId].join("|");
            return l;
          }),
          "id"
        );
        return ids.map((id) => get(keyByIds, id + ".count", 0));
      });
    },
    { cache: false }
  );
  public issuedByCustomer = new DataLoader<string, number>(
    (ids: string[]) => {
      const splits = ids.map((id) => id.split("|"));
      const wheelIds = splits.map((l) => Types.ObjectId(l[0]));
      const customerIds = splits.map((l) => Types.ObjectId(l[1]));
      return LuckyWheelResultModel.aggregate([
        {
          $match: {
            luckyWheelId: { $in: wheelIds },
            customerId: { $in: customerIds },
          },
        },
        {
          $group: {
            _id: { wId: "$luckyWheelId", cId: "$customerId" },
            count: { $sum: 1 },
          },
        },
      ]).then((list) => {
        const keyByIds = keyBy(
          list.map((l) => {
            l.id = [l._id.wId, l._id.cId].join("|");
            return l;
          }),
          "id"
        );
        return ids.map((id) => get(keyByIds, id + ".count", 0));
      });
    },
    { cache: false }
  );
}

export const luckyWheelLoader = new LuckyWheelLoader();
