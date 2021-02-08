import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { notificationService } from "./notification.service";
import _ from "lodash";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { UserLoader } from "../user/user.model";

const Query = {
  getAllNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const userId = context.tokenData._id;
    _.set(args, "q.filter.userId", userId);
    console.log(args.q);
    return notificationService.fetch(args.q);
  },
  getOneNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await notificationService.findOne({ _id: id });
  },
};

const Mutation = {
  createNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, []);
    const { data } = args;
    return await notificationService.create(data);
  },
  updateNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, []);
    const { id, data } = args;
    return await notificationService.updateOne(id, data);
  },
  deleteOneNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, []);
    const { id } = args;
    return await notificationService.deleteOne(id);
  },
  deleteManyNotification: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, []);
    const { ids } = args;
    let result = await notificationService.deleteMany(ids);
    return result;
  },
};

const Notification = {
  user: GraphQLHelper.loadById(UserLoader, "userId"),
};

export default {
  Query,
  Mutation,
  Notification,
};
