import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { addressStorehouseImportingLogService } from "./addressStorehouseImportingLog.service";

const Query = {
  getAllAddressStorehouseImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return addressStorehouseImportingLogService.fetch(args.q);
  },
  getOneAddressStorehouseImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await addressStorehouseImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressStorehouseImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await addressStorehouseImportingLogService.create(data);
  },
  updateAddressStorehouseImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await addressStorehouseImportingLogService.updateOne(id, data);
  },
  deleteOneAddressStorehouseImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await addressStorehouseImportingLogService.deleteOne(id);
  },
};

const AddressStorehouseImportingLog = {
  
};

export default {
  Query,
  Mutation,
  AddressStorehouseImportingLog,
};
