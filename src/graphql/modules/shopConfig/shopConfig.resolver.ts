import { ROLES } from "../../../constants/role.const";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ShopConfigModel } from "./shopConfig.model";

const Mutation = {
  updateShopConfig: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    return await ShopConfigModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    ).exec();
  },
};

const ShopConfig = {
  colCommissionBy: GraphQLHelper.requireRoles([ROLES.MEMBER]),
  colCommissionUnit: GraphQLHelper.requireRoles([ROLES.MEMBER]),
  colCommissionValue: GraphQLHelper.requireRoles([ROLES.MEMBER]),
};

export default {
  Mutation,
  ShopConfig,
};
