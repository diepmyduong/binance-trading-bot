import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { branchService } from "./branch.service";

const Query = {
  getAllBranch: async (root: any, args: any, context: Context) => {
    // AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    return branchService.fetch(args.q);
  },
  getOneBranch: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await branchService.findOne({ _id: id });
  },
};

const Mutation = {
  createBranch: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { data } = args;
    return await branchService.create(data);
  },
  updateBranch: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    return await branchService.updateOne(id, data);
  },
  deleteOneBranch: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await branchService.deleteOne(id);
  },
  deleteManyBranch: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await branchService.deleteMany(ids);
    return result;
  },
};

const Branch = {};

export default {
  Query,
  Mutation,
  Branch,
};
