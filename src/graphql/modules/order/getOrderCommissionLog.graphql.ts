import { gql } from "apollo-server-express";
import DataLoader from "dataloader";
import { get, keyBy } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CommissionLogModel, ICommissionLog } from "../commissionLog/commissionLog.model";
import {
  CustomerCommissionLogModel,
  ICustomerCommissionLog,
} from "../customerCommissionLog/customerCommissionLog.model";
import { IOrder } from "./order.model";

export default {
  schema: gql`
    extend type Order {
      commissionLogs: [CommissionLog]
      customerCommissionLogs: [CustomerCommissionLog]
    }
  `,
  resolver: {
    Order: {
      commissionLogs: async (root: IOrder, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        return commissionLogLoader.load(root._id.toString());
      },
      customerCommissionLogs: async (root: IOrder, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        return customerCommissionLogLoader.load(root._id);
      },
    },
  },
};

const commissionLogLoader = new DataLoader<string, ICommissionLog>(
  async (ids: string[]) => {
    return await CommissionLogModel.aggregate([
      { $match: { orderId: { $in: ids.map(Types.ObjectId) } } },
      { $group: { _id: "$orderId", logs: { $push: "$$ROOT" } } },
    ]).then((list) => {
      const listKeyBy = keyBy(list, "_id");
      return ids.map((id) =>
        get(listKeyBy, `${id}.logs`, []).map((o: any) => new CommissionLogModel(o))
      );
    });
  },
  { cache: false } // Bỏ cache
);
const customerCommissionLogLoader = new DataLoader<string, ICustomerCommissionLog>(
  async (ids: string[]) => {
    return await CustomerCommissionLogModel.aggregate([
      { $match: { orderId: { $in: ids.map(Types.ObjectId) } } },
      { $group: { _id: "$orderId", logs: { $push: "$$ROOT" } } },
    ]).then((list) => {
      const listKeyBy = keyBy(list, "_id");
      return ids.map((id) =>
        get(listKeyBy, `${id}.logs`, []).map((o: any) => new CustomerCommissionLogModel(o))
      );
    });
  },
  { cache: false } // Bỏ cache
);
