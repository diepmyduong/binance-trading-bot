import { set } from "lodash";
import { ObjectId } from "mongodb";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { ProductLoader, ProductModel, ProductType } from "../product/product.model";
import { CrossSaleModel } from "./crossSale.model";
import { crossSaleService } from "./crossSale.service";

const Query = {
  getAllCrossSale: async (root: any, args: any, context: Context) => {
    if (context.isCustomer()) {
      set(args, "q.filter.sellerId", context.sellerId);
    } else if (!context.isAuth) {
      const seller = await MemberModel.findOne({ code: context.memberCode });
      set(args, "q.filter.sellerId", seller._id);
    } else {
      AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
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
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { productId } = args;

    const { id: sellerId } = context;
    // const sellerId = "5fdb11aef490bdad0817d60b";

    // check exist in crossSale

    const existed = await CrossSaleModel.findOne({ productId, sellerId });

    if (existed) {
      return existed;
    }

    const products = await ProductModel.aggregate([
      {
        $match: {
          _id: new ObjectId(productId),
          type: ProductType.RETAIL,
          isCrossSale: true,
          crossSaleInventory: { $gt: 0 },
        },
      },
      { $match: { $expr: { $gte: ["$crossSaleInventory", "$crossSaleOrdered"] } } },
    ]);

    // console.log('products', products);

    if (Object.keys(products).length !== 1) throw ErrorHelper.productNotExist();

    if (products[0].memberId === sellerId) {
      throw ErrorHelper.requestDataInvalid("thành viên");
    }

    return await crossSaleService.create({ productId, sellerId });
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
