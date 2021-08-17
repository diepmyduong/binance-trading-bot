import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { addressService } from "./address.service";

const Query = {
  getAllAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    return addressService.fetch(args.q);
  },
  getOneAddress: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await addressService.findOne({ _id: id });
  },
};

const Mutation = {
  createAddress: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { data } = args;
    return await addressService.create(data);
  },
  updateAddress: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { id, data } = args;
    return await addressService.updateOne(id, data);
  },
  deleteOneAddress: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { id } = args;
    return await addressService.deleteOne(id);
  },
  deleteManyAddress: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { ids } = args;
    let result = await addressService.deleteMany(ids);
    return result;
  },
};

const Address = {};

export default {
  Query,
  Mutation,
  Address,
};
