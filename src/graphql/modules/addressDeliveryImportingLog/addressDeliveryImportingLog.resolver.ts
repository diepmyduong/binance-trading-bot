import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { addressDeliveryImportingLogService } from "./addressDeliveryImportingLog.service";

const Query = {
  getAllAddressDeliveryImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return addressDeliveryImportingLogService.fetch(args.q);
  },
  getOneAddressDeliveryImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await addressDeliveryImportingLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressDeliveryImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await addressDeliveryImportingLogService.create(data);
  },
  updateAddressDeliveryImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await addressDeliveryImportingLogService.updateOne(id, data);
  },
  deleteOneAddressDeliveryImportingLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await addressDeliveryImportingLogService.deleteOne(id);
  },
};

const AddressDeliveryImportingLog = {
  
};

export default {
  Query,
  Mutation,
  AddressDeliveryImportingLog,
};
