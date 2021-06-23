import { set } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { ProductLoader } from "../product/product.model";
import { CategoryHelper } from "./category.helper";
import { CategoryModel } from "./category.model";
import { categoryService } from "./category.service";

const Query = {
  getAllCategory: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER);
    set(args, "q.filter.memberId", context.sellerId);
    return categoryService.fetch(args.q);
  },
  getOneCategory: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ANONYMOUS_CUSTOMER_MEMBER);
    const { id } = args;
    return await categoryService.findOne({ _id: id });
  },
  getFilteringCategories: async (root: any, args: any, context: Context) => {
    return await CategoryModel.find({ isPrimary: true });
  },
};

const Mutation = {
  createCategory: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.sellerId;
    data.code = data.code || (await CategoryHelper.generateCode());
    return await categoryService.create(data);
  },
  updateCategory: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await categoryService.updateOne(id, data);
  },
  deleteOneCategory: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    const category = await protectDoc(id, context);
    if (category.productIds.length > 0) throw Error("Không thể xoá khi còn sản phẩm");
    return await categoryService.deleteOne(id);
  },
};

const Category = {
  products: GraphQLHelper.loadManyById(ProductLoader, "productIds"),
};

export default {
  Query,
  Mutation,
  Category,
};
async function protectDoc(id: any, context: Context) {
  const category = await CategoryModel.findById(id);
  if (category.memberId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
  return category;
}
