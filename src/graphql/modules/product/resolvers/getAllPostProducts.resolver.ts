import { set } from "lodash";
import { Context } from "../../../context";
import { productService } from "../product.service";

const Query = {
  getAllPostProducts: async (root: any, args: any, context: Context) => {
    return await productService.fetch(args.q);
  },
};

export default {
  Query,
};
