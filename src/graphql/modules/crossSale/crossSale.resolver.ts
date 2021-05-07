import { set } from "lodash";
import { ObjectId } from 'mongodb';
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ProductLoader, ProductModel, ProductType } from "../product/product.model";
import { CrossSaleModel } from "./crossSale.model";
import { crossSaleService } from "./crossSale.service";

const Query = {
  getAllCrossSale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);

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
      throw ErrorHelper.duplicateError('Đăng ký bán chéo');
    }

    const products = await ProductModel.aggregate(
      [
        {
          $match: {
            _id: new ObjectId(productId),
            type: ProductType.RETAIL,
            isCrossSale: true,
          }
        },
      ]
    );

    // console.log('products', products);

    if (Object.keys(products).length !== 1)
      throw ErrorHelper.productNotExist();

    if (products[0].memberId === sellerId) {
      throw ErrorHelper.requestDataInvalid('thành viên');
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
  product: GraphQLHelper.loadById(ProductLoader, 'productId')
};

export default {
  Query,
  Mutation,
  CrossSale,
};
