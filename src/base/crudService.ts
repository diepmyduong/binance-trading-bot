import { set, values } from "lodash";
import { Model } from "mongoose";

import { queryErrorNotFound } from "../errors/query.error";
import { BaseService } from "./service";

// import { IBaseStatic } from "./baseModel";
// import { baseError } from "./baseError";
export interface IQueryInput {
  page?: number;
  limit?: number;
  offset?: number;
  order?: any;
  filter?: any;
  select?: any;
  search?: string;
}

export abstract class CrudService extends BaseService {
  model: Model<any>;

  constructor(model: Model<any>) {
    super();
    this.model = model;
  }

  async fetch(queryInput: IQueryInput, select?: string) {
    queryInput = { ...queryInput };
    const limit = queryInput.limit || 10;
    const skip = queryInput.offset || (queryInput.page - 1) * limit || 0;
    const order = queryInput.order;
    const search = queryInput.search;
    const query = this.model.find();

    if (search) {
      if (search.includes(" ")) {
        set(queryInput, "filter.$text.$search", search);
        query.select({ _score: { $meta: "textScore" } });
        query.sort({ _score: { $meta: "textScore" } });
      } else {
        const textSearchIndex = this.model.schema
          .indexes()
          .filter((c: any) => values(c[0]!).some((d: any) => d == "text"));
        if (textSearchIndex.length > 0) {
          const or: any[] = [];
          textSearchIndex.forEach((index) => {
            Object.keys(index[0]!).forEach((key) => {
              or.push({ [key]: { $regex: search, $options: "i" } });
            });
          });
          set(queryInput, "filter.$or", or);
        }
      }
    }

    if (order) {
      query.sort(order);
    }
    if (queryInput.filter) {
      const filter = JSON.parse(
        JSON.stringify(queryInput.filter).replace(/\"(\_\_)(\w+)\"\:/g, `"$$$2":`)
      );
      query.setQuery({ ...filter });
    }
    const countQuery = this.model.find().merge(query);
    query.limit(limit);
    query.skip(skip);
    // console.time("Fetch");
    // console.time("Count");
    if (select) {
      query.select(select);
    }
    return await Promise.all([
      query.exec().then((res) => {
        // console.timeEnd("Fetch");
        return res;
      }),
      countQuery.count().then((res) => {
        // console.timeEnd("Count");
        return res;
      }),
    ]).then((res) => {
      return {
        data: res[0],
        total: res[1],
        pagination: {
          page: queryInput.page || 1,
          limit: limit,
          offset: skip,
          total: res[1],
        },
      };
    });
  }

  async findOne(filter: any) {
    return await this.model.findOne(filter);
  }

  async count(options: IQueryInput) {
    return await this.model.countDocuments(options.filter);
  }

  async create(data: any) {
    return await this.model.create(data);
  }

  async updateOne(id: string, data: any) {
    await this.model.updateOne({ _id: id }, data);
    let record = await this.model.findOne({ _id: id });
    if (!record) throw queryErrorNotFound;
    return record;
  }

  async deleteOne(id: string) {
    let record = await this.model.findOne({ _id: id });
    if (!record) throw queryErrorNotFound;
    await record.remove();
    return record;
  }

  async deleteMany(ids: string[]) {
    let result = await this.model.deleteMany({ _id: { $in: ids } });
    return result.deletedCount;
  }
}
