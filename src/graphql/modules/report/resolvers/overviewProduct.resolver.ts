import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, UtilsHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { set } from "lodash";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { productService } from "../../product/product.service";
import { ProductStats } from "../loaders/productStats.loader";
import { IProduct } from "../../product/product.model";

const getProductReportsOverview = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  let { fromDate, toDate, sellerIds } = args;

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const params = {};

  if ($gte) {
    set(params, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set(params, "loggedAt.$lte", $lte);
  }

  if (context.isMember()) {
    set(params, "sellerId.$in", [new ObjectId(context.id)]);
  }
  else {
    if (sellerIds) {
      if (sellerIds.length > 0) {
        set(params, "sellerId.$in", sellerIds.map(Types.ObjectId));
      }
    }
  }


  return {

  }
};

const getProductReports = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const queryInput = args.q;
  let { sellerIds } = queryInput.filter;
  return productService.fetch(args.q);
};

const OverviewProduct = {
  productStats: async (root: IProduct, args: any, context: Context) => {
    const { memberIds } = args;
    
    if (context.isMember()) {
      set(args, "sellerId.$in", [new ObjectId(context.id)]);
    }
    else {
      if (memberIds) {
        if (memberIds.length > 0) {
          set(args, "sellerId.$in", memberIds.map(Types.ObjectId));
        }
      }
    }

    return ProductStats.getLoader(args).load(root.id);
  },
}

const Query = {
  getProductReportsOverview,
  getProductReports
};

export default {
  Query,
  OverviewProduct
};
