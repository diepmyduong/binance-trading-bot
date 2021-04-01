import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { CategoryHelper } from "./category.helper";
import { CategoryModel } from "./category.model";
import { categoryService } from "./category.service";

const Query = {
  getAllCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    return categoryService.fetch(args.q);
  },
  getOneCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await categoryService.findOne({ _id: id });
  },
  getFilteringCategories: async (root: any, args: any, context: Context) => {
    return await CategoryModel.find({isPrimary:true});
  },
};

const Mutation = {
  createCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { data } = args;
    // member tao duoc san pham mo rong
    if (context.tokenData.role == ROLES.MEMBER) {
      data.memberId = context.tokenData._id;
    } else {
      // admin tao san pham chinh
      data.isPrimary = true;
    }
    data.code = data.code || (await CategoryHelper.generateCode());
    return await categoryService.create(data);
  },
  updateCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id, data } = args;
    if (context.tokenData.role == ROLES.MEMBER) {
      const category = await CategoryModel.findById(id);
      if (category.memberId.toString() != context.tokenData._id) {
        throw ErrorHelper.permissionDeny();
      }
    }
    return await categoryService.updateOne(id, data);
  },
  deleteOneCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const { id } = args;
    return await categoryService.deleteOne(id);
  },
  deleteManyCategory: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await categoryService.deleteMany(ids);
    return result;
  },
};

const Category = {};

export default {
  Query,
  Mutation,
  Category,
};
