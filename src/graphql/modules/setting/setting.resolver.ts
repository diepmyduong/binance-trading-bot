import { set } from "lodash";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { GraphqlResolver } from "../../graphqlResolver";
import { SettingGroupLoader } from "./settingGroup/settingGroup.model";
import { settingService } from "./setting.service";

const Query = {
  getAllSetting: async (root: any, args: any, context: Context) => {
    if (!context.isAdmin) {
      set(args, "q.filter.isPrivate", false);
      set(args, "q.filter.isSecret", false);
    }
    set(args, "q.order", { sort: -1 });
    return settingService.fetch(args.q);
  },
};

const Mutation = {
  updateSetting: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.ADMIN]);
    const { id, data } = args;
    return await settingService.updateOne(id, data);
  },
};

const Setting = {
  group: GraphqlResolver.loadById(SettingGroupLoader, "groupId"),
};

export default {
  Query,
  Mutation,
  Setting,
};
