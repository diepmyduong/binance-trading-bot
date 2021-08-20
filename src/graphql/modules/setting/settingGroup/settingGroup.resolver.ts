import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { settingGroupService } from "./settingGroup.service";
import { SettingModel } from "../setting.model";
import { set } from "lodash";

const Query = {
  getAllSettingGroup: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    set(args, "q.order", { sort: 1 });
    return settingGroupService.fetch(args.q);
  },
};

const SettingGroup = {
  settings: async (root: any, args: any, context: Context) => {
    return await SettingModel.find({ groupId: root["id"] });
  },
};

export default {
  Query,
  SettingGroup,
};
