import { set } from "lodash";

import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { ProductToppingModel } from "./productTopping.model";
import { productToppingService } from "./productTopping.service";

const Query = {
  getAllProductTopping: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    set(args, "q.filter.memberId", context.id);
    return productToppingService.fetch(args.q);
  },
  getOneProductTopping: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    return await productToppingService.findOne({ _id: id });
  },
};

const Mutation = {
  createProductTopping: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.id;
    return await productToppingService.create(data);
  },
  updateProductTopping: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    const topping = await ProductToppingModel.findById(id);
    if (topping.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
    return await productToppingService.updateOne(id, data);
  },
  deleteOneProductTopping: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    const topping = await ProductToppingModel.findById(id);
    if (topping.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
    return await productToppingService.deleteOne(id);
  },
};

const ProductTopping = {};

export default {
  Query,
  Mutation,
  ProductTopping,
};
