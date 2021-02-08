import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { addressDeliveryService } from "./addressDelivery.service";

const Query = {
  getAllAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return addressDeliveryService.fetch(args.q);
  },
  getOneAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await addressDeliveryService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await addressDeliveryService.create(data);
  },
  updateAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await addressDeliveryService.updateOne(id, data);
  },
  deleteOneAddressDelivery: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await addressDeliveryService.deleteOne(id);
  },
};

const AddressDelivery = {
  
};

export default {
  Query,
  Mutation,
  AddressDelivery,
};
