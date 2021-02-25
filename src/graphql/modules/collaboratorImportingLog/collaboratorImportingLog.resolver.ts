import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { collaboratorImportingLogService } from "./collaboratorImportingLog.service";

const Query = {
  getAllCollaboratorImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return collaboratorImportingLogService.fetch(args.q);
  },
  getOneCollaboratorImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await collaboratorImportingLogService.findOne({ _id: id });
  },
};

const CollaboratorImportingLog = {
  
};

export default {
  Query,
  CollaboratorImportingLog,
};
