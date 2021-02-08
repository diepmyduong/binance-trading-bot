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
  getMobifoneProducts: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    set(args, "q.filter.isPrimary", true);
    return productService.fetch(args.q);
  }
};

export default {
  Query
};
