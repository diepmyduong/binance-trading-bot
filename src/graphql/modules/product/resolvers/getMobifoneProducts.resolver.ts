import { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { productService } from "../product.service";

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
