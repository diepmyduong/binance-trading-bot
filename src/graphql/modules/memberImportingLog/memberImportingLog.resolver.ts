import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { memberImportingLogService } from "./memberImportingLog.service";

const Query = {
  getAllMemberImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return memberImportingLogService.fetch(args.q);
  },
  getOneMemberImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await memberImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createMemberImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await memberImportingLogService.create(data);
  },
  updateMemberImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await memberImportingLogService.updateOne(id, data);
  },
  deleteOneMemberImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await memberImportingLogService.deleteOne(id);
  },
};

const MemberImportingLog = {
  
};

export default {
  Query,
  Mutation,
  MemberImportingLog,
};
