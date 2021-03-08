import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { storeHouseCommissionLogService } from "./storeHouseCommissionLog.service";

const Query = {
  getAllStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return storeHouseCommissionLogService.fetch(args.q);
  },
  getOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await storeHouseCommissionLogService.findOne({ _id: id });
  },
};

const Mutation = {
  deleteOneStoreHouseCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await storeHouseCommissionLogService.deleteOne(id);
  },
};

const StoreHouseCommissionLog = {
  
};

export default {
  Query,
  Mutation,
  StoreHouseCommissionLog,
};
