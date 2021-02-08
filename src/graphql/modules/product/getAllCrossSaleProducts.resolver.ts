import { omit, set, isNull } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CategoryLoader } from "../category/category.model";
import { CrossSaleModel } from "../crossSale/crossSale.model";
import { MemberHelper } from "../member/member.helper";
import { IMember, MemberLoader, MemberModel } from "../member/member.model";
import { ProductHelper } from "./product.helper";
import { IProduct, ProductModel, ProductType } from "./product.model";
import { productService } from "./product.service";

const Query = {
  getAllCrossSaleProducts: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    let seller: IMember;
    if (context.isCustomer()) {
      seller = await MemberModel.findById(context.sellerId);
    } else if (context.isMember()) {
      seller = await MemberModel.findById(context.id);
    } else {
      seller = await MemberModel.findById(args.sellerId);
    }
    if (!seller) throw ErrorHelper.mgRecoredNotFound("Cửa hàng");
    const crossSaleProducts = await CrossSaleModel.find({
      sellerId: seller._id,
    });
    const products = await ProductModel.find({
      _id: { $in: crossSaleProducts.map((c) => c.productId) },
    });

    return products.map((p: IProduct) => {
      p.outOfStock = p.crossSaleInventory - p.crossSaleOrdered <= 0;
      return p;
    });
  },
};

export default {
  Query,
};
