import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ShopConfigModel } from "./shopConfig.model";

export default {
  schema: gql`
    extend type Query {
      getShopConfig: ShopConfig
    }
  `,
  resolver: {
    Query: {
      getShopConfig: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        return ShopConfigModel.findOneAndUpdate(
          { memberId: context.id },
          {},
          { new: true, upsert: true }
        ).exec();
      },
    },
  },
};
