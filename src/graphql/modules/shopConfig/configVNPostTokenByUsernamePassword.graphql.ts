import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { VietnamPostHelper } from "../../../helpers";
import { Context } from "../../context";
import { ShopConfigModel } from "./shopConfig.model";

export default {
  schema: gql`
    extend type Mutation {
      configVNPostTokenByUsernamePassword(username: String!, password: String!): ShopConfig
    }
  `,
  resolver: {
    Mutation: {
      configVNPostTokenByUsernamePassword: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { username, password } = args;
        const tokenData = await VietnamPostHelper.getToken(username, password);
        const shopConfig = await ShopConfigModel.findOneAndUpdate(
          { memberId: context.id },
          { $set: tokenData },
          { new: true, upsert: true }
        ).exec();
        return shopConfig;
      },
    },
  },
};
