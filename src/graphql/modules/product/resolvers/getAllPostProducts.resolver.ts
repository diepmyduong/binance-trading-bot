import { set } from "lodash";
import { Context } from "../../../context";
import { productService } from "../product.service";

const Query = {
  getAllPostProducts: async (root: any, args: any, context: Context) => {
    set(args, "q.filter.allowSale", true);
    set(args, "q.filter.isCrossSale", false);
    set(args, "q.filter.isPrimary", true);
    return await productService.fetch(args.q);
  },
};

export default {
  Query,
};
