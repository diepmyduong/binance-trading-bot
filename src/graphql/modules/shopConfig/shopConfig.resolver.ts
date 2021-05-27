import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ShopConfigModel } from "./shopConfig.model";

const Mutation = {
  updateShopConfig: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    return await ShopConfigModel.findOneAndUpdate(
      { memberId: id },
      { $set: data },
      { new: true }
    ).exec();
  },
};

const ShopConfig = {};

export default {
  Mutation,
  ShopConfig,
};
