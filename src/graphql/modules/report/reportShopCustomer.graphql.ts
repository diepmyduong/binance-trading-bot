import { gql } from "apollo-server-express";
import { get } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CustomerModel } from "../customer/customer.model";

export default {
  schema: gql`
    extend type Query {
      reportShopCustomer: ReportShopCustomerData
    }
    type ReportShopCustomerData {
      total: Int
    }
  `,
  resolver: {
    Query: {
      reportShopCustomer: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.MEMBER_STAFF);
        return await CustomerModel.aggregate([
          { $match: { memberId: Types.ObjectId(context.sellerId) } },
          { $group: { _id: null, total: { $sum: 1 } } },
        ]).then((res) => get(res, "0", { total: 0 }));
      },
    },
  },
};
