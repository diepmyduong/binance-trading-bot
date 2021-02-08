import _ from "lodash";
import { SettingKey, SETTING_DATA } from "../../../configs/settingData";
import { SettingGroupModel } from "../settingGroup/settingGroup.model";
import { SettingModel, SettingKeyLoader, ISetting } from "./setting.model";
export type SettingLoadOption = {
  secure?: Boolean;
};
export class SettingHelper {
  static defaultSettings = _.reduce(
    SETTING_DATA,
    (result, value) => {
      value.settings.forEach((s: any) => (result[s.key] = s.value));
      return result;
    },
    {} as any
  );
  static async seedingSetting() {
    const settingGroups = await SettingGroupModel.find();
    const settings = await SettingModel.find();
    for (const GROUP of SETTING_DATA) {
      let settingGroup = settingGroups.find((g: any) => g.slug == GROUP.slug);
      if (!settingGroup) {
        console.log("Bổ sung nhóm cấu hình ", GROUP.name);
        settingGroup = await SettingGroupModel.create({
          slug: GROUP.slug,
          name: GROUP.name,
          desc: GROUP.desc,
          readOnly: GROUP.readOnly,
          // settingIds: [],
        });
      }
      for (const SETTING of GROUP.settings) {
        let setting = settings.find((s: any) => s.key == SETTING.key);
        if (!setting) {
          console.log("Bổ sung cấu hình", SETTING.name);
          setting = await SettingModel.create({
            ...SETTING,
            groupId: settingGroup._id.toString(),
          });
          //settingGroup.settingIds.push(setting._id);
        }
        //SettingKeyLoader.prime(setting.key, setting);
      }
      await settingGroup.save();
    }
  }
  static load(key: SettingKey, option: SettingLoadOption = {}) {
    return SettingKeyLoader.load(key).then((setting) => {
      setting = setting ? setting : this.defaultSettings[key];
      if (setting.isPrivate && option.secure) {
        return undefined;
      }
      return setting.value;
    });
  }
  static loadMany(keys: SettingKey[], option: SettingLoadOption = {}) {
    return SettingKeyLoader.loadMany(keys).then((settings) =>
      settings.map((setting: ISetting, index) => {
        setting = setting ? setting : this.defaultSettings[keys[index]];
        if (setting.isPrivate && option.secure) {
          return undefined;
        }
        return setting.value;
      })
    );
  }
}
