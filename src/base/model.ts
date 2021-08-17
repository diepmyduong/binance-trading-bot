import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { ttlCache } from "../helpers/ttlCache";

export type BaseDocument = mongoose.Document & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type Model<T extends BaseDocument> = mongoose.Model<T>;

export function ModelLoader<T>(model: any): DataLoader<string, T> {
  model.schema.plugin(uniqueValidator, { message: "{VALUE} đã tồn tại." });
  let loader: DataLoader<string, T>;
  const batchFunction = (ids: string[]) => {
    return model.find({ _id: { $in: ids } }).then((list: any[]) => {
      const listByKey = keyBy(list, "_id");
      return ids.map((id) => get(listByKey, id, undefined));
    });
  };
  loader = new DataLoader<string, T>(
    batchFunction,
    { cacheMap: ttlCache({ ttl: 10000, maxSize: 100 }) } // Giới hạn chỉ cache 100 item sử dụng nhiêu nhất.
  );

  return loader;
}
export function ModelSelectLoader<T>(model: any, select: string): DataLoader<string, T> {
  model.schema.plugin(uniqueValidator, { message: "{VALUE} đã tồn tại." });
  let loader: DataLoader<string, T>;
  const batchFunction = (ids: string[]) => {
    return model
      .find({ _id: { $in: ids } })
      .select(select)
      .exec()
      .then((list: any[]) => {
        const listByKey = keyBy(list, "_id");
        return ids.map((id) => get(listByKey, id, undefined));
      });
  };
  loader = new DataLoader<string, T>(
    batchFunction,
    { cache: true, cacheMap: ttlCache({}) } // Giới hạn chỉ cache 100 item sử dụng nhiêu nhất.
  );
  return loader;
}
