import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { regisSMSImportingLogService } from "./regisSMSImportingLog.service";

const Query = {
  getAllRegisSMSImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return regisSMSImportingLogService.fetch(args.q);
  },
  getOneRegisSMSImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await regisSMSImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneRegisSMSImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await regisSMSImportingLogService.deleteOne(id);
  },
};

const RegisSMSImportingLog = {
  
};

export default {
  Query,
  Mutation,
  RegisSMSImportingLog,
};
