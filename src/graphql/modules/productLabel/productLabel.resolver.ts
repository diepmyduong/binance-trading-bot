import { set } from "lodash";

import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ProductLabelModel } from "./productLabel.model";
import { productLabelService } from "./productLabel.service";

const Query = {
  getAllProductLabel: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    set(args, "q.filter.memberId", context.sellerId);
    return productLabelService.fetch(args.q);
  },
  getOneProductLabel: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER_STAFF);
    const { id } = args;
    return await productLabelService.findOne({ _id: id });
  },
};

const Mutation = {
  createProductLabel: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.sellerId;
    return await productLabelService.create(data);
  },
  updateProductLabel: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await productLabelService.updateOne(id, data);
  },
  deleteOneProductLabel: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    await protectDoc(id, context);
    return await productLabelService.deleteOne(id);
  },
};

const ProductLabel = {};

export default {
  Query,
  Mutation,
  ProductLabel,
};
async function protectDoc(id: any, context: Context) {
  const item = await ProductLabelModel.findById(id);
  if (item.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
}
