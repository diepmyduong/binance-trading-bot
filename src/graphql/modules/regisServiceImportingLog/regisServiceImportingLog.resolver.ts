import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { regisServiceImportingLogService } from "./regisServiceImportingLog.service";

const Query = {
  getAllRegisServiceImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return regisServiceImportingLogService.fetch(args.q);
  },
  getOneRegisServiceImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await regisServiceImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createRegisServiceImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await regisServiceImportingLogService.create(data);
  },
  updateRegisServiceImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await regisServiceImportingLogService.updateOne(id, data);
  },
  deleteOneRegisServiceImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await regisServiceImportingLogService.deleteOne(id);
  },
};

const RegisServiceImportingLog = {
  
};

export default {
  Query,
  Mutation,
  RegisServiceImportingLog,
};
