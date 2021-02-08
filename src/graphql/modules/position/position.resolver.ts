import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { positionService } from "./position.service";

const Query = {
  getAllPosition: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return positionService.fetch(args.q);
  },
  getOnePosition: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await positionService.findOne({ _id: id });
  },
};

const Mutation = {
  createPosition: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await positionService.create(data);
  },
  updatePosition: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await positionService.updateOne(id, data);
  },
  deleteOnePosition: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await positionService.deleteOne(id);
  },
};

const Position = {

};

export default {
  Query,
  Mutation,
  Position,
};
