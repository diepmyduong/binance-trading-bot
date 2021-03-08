import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { productImportingLogService } from "./productImportingLog.service";

const Query = {
  getAllProductImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return productImportingLogService.fetch(args.q);
  },
  getOneProductImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await productImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneProductImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await productImportingLogService.deleteOne(id);
  },
};

const ProductImportingLog = {
  
};

export default {
  Query,
  Mutation,
  ProductImportingLog,
};
