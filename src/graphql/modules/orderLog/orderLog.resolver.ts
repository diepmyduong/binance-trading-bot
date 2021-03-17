import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { orderLogService } from "./orderLog.service";

const Query = {
  getAllOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return orderLogService.fetch(args.q);
  },
  getOneOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await orderLogService.findOne({ _id: id });
  },
};

const Mutation = {
  createOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await orderLogService.create(data);
  },
  updateOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await orderLogService.updateOne(id, data);
  },
  deleteOneOrderLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await orderLogService.deleteOne(id);
  },
};

const OrderLog = {
  
};

export default {
  Query,
  Mutation,
  OrderLog,
};
