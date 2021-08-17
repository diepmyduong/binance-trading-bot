import path from "path";

import { walkSyncFiles } from "../../../helpers/common";
import { SettingResource } from "./resource";
import { SettingModel } from "./setting.model";
import { SettingGroupModel } from "./settingGroup/settingGroup.model";

export default async function execute() {
  const settingGroups = await SettingGroupModel.find();
  const settings = await SettingModel.find();
  const configFiles = walkSyncFiles(path.join(__dirname, "configs"));
  const schemas: SettingResource.ConfigSchema[] = [];
  configFiles
    .filter((f: any) => /(.*).js$/.test(f))
    .map((f: any) => {
      const { default: schema } = require(f);
      schemas.push(schema);
    });

  for (const group of schemas) {
    let settingGroup = settingGroups.find((g: any) => g.slug == group.slug);
    if (!settingGroup) {
      console.log("Bổ sung nhóm cấu hình ", group.name);
      settingGroup = await SettingGroupModel.create({
        slug: group.slug,
        name: group.name,
        desc: group.desc,
      });
    }
    for (const setting of group.settings) {
      let oldSetting = settings.find((s: any) => s.key == setting.key);
      if (!oldSetting) {
        console.log("Bổ sung cấu hình", setting.name);
        await SettingModel.create({
          ...setting,
          groupId: settingGroup._id.toString(),
        });
      }
    }
    await settingGroup.save();
  }
}
