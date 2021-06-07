import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ProductModel } from "../product/product.model";
import { bannerService } from "./banner.service";

const Query = {
  getAllBanner: async (root: any, args: any, context: Context) => {
    if (!context.isAdmin() || !context.isEditor()) {
      set(args, "q.filter.isPublish", true);
    }
    return bannerService.fetch(args.q);
  },
  getOneBanner: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await bannerService.findOne({ _id: id });
  },
};

const Mutation = {
  createBanner: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { data } = args;
    return await bannerService.create(data);
  },
  updateBanner: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    return await bannerService.updateOne(id, data);
  },
  deleteOneBanner: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await bannerService.deleteOne(id);
  },
};

const Banner = {
  product: GraphQLHelper.loadById(ProductModel, "productId"),
};

export default {
  Query,
  Mutation,
  Banner,
};
