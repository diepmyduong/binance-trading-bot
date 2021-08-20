import { BaseModel, CrudRepository } from "./crud.repo";
import { Setting } from "./setting.repo";

export interface SettingGroup extends BaseModel {
  slug: string;
  name: string;
  desc: string;
  settings: Setting[];
}
export class SettingGroupRepository extends CrudRepository<SettingGroup> {
  apiName: string = "SettingGroup";
  displayName: string = "nhóm cấu hình";
  shortFragment: string = this.parseFragment(`
    id: String
    slug: String
    name: String
    desc: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    slug: String
    name: String
    desc: String
    settings {
      id: String
      type: String
      name: String
      key: String
      value: Mixed
      isActive: Boolean
      isPrivate: Boolean
      isSecret: Boolean
    }: [Setting]
  `);
}

export const SettingGroupService = new SettingGroupRepository();
