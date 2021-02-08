import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { settingService } from "./setting.service";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { SettingGroupLoader } from "../settingGroup/settingGroup.model";
import { set } from "lodash";

const Query = {
  getAllSetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    if (context.isCustomer() || context.isMember() || context.isMessenger()) {
      set(args, "q.filter.isPrivate", false);
    }
    return settingService.fetch(args.q);
  },
  getOneSetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await settingService.findOne({ _id: id });
  },
  getOneSettingByKey: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { key } = args;
    return await settingService.findOne({ key: key });
  },
};

const Mutation = {
  createSetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { data } = args;
    return await settingService.create(data);
  },
  updateSetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id, data } = args;
    return await settingService.updateOne(id, data);
  },
  deleteOneSetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await settingService.deleteOne(id);
  },
  deleteManySetting: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await settingService.deleteMany(ids);
    return result;
  },
};

const Setting = {
  group: GraphQLHelper.loadById(SettingGroupLoader, "groupId"),
};

export default {
  Query,
  Mutation,
  Setting,
};
