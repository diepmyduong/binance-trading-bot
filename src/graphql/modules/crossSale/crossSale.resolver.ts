import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { ProductLoader, ProductModel } from "../product/product.model";
import { CrossSaleModel } from "./crossSale.model";
import { crossSaleService } from "./crossSale.service";
import { getCrossSaleProduct } from "./lib/common";

const Query = {
  getAllCrossSale: async (root: any, args: any, context: Context) => {
    if (context.isCustomer()) {
      set(args, "q.filter.sellerId", context.sellerId);
    } else if (context.memberCode) {
      const seller = await MemberModel.findOne({ code: context.memberCode });
      set(args, "q.filter.sellerId", seller._id);
    } else {
      if (context.isMember()) {
        set(args, "q.filter.sellerId", context.id);
      }
    }
    console.log("args.q", args.q);
    return crossSaleService.fetch(args.q);
  },
  getOneCrossSale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await crossSaleService.findOne({ _id: id });
  },
};

const Mutation = {
  createCrossSale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { productId } = args;
    const product = await getCrossSaleProduct(productId);
    return await CrossSaleModel.findOneAndUpdate(
      { productId: product._id, sellerId: context.id },
      { $set: { productName: product.name } },
      { new: true, upsert: true }
    ).exec();
  },
  deleteOneCrossSale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    return await crossSaleService.deleteOne(id);
  },
};

const CrossSale = {
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
};

export default {
  Query,
  Mutation,
  CrossSale,
};
