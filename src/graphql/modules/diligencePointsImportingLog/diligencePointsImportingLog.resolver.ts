import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { diligencePointsImportingLogService } from "./diligencePointsImportingLog.service";

const Query = {
  getAllDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return diligencePointsImportingLogService.fetch(args.q);
  },
  getOneDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await diligencePointsImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await diligencePointsImportingLogService.create(data);
  },
  updateDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await diligencePointsImportingLogService.updateOne(id, data);
  },
  deleteOneDiligencePointsImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await diligencePointsImportingLogService.deleteOne(id);
  },
};

const DiligencePointsImportingLog = {
  
};

export default {
  Query,
  Mutation,
  DiligencePointsImportingLog,
};
