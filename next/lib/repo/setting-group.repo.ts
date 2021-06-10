import { BaseModel, CrudRepository } from "./crud.repo";
import { Setting } from "./setting.repo";

export interface SettingGroup extends BaseModel {
  slug: string;
  name: string;
  desc: string;
  readOnly: boolean;
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
    readOnly: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    slug: String
    name: String
    desc: String
    readOnly: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    settings {
      id: String
      type: String
      name: String
      key: String
      value: Mixed
      isActive: Boolean
      isPrivate: Boolean
      readOnly: Boolean
    }: [Setting]
  `);
}

export const SettingGroupService = new SettingGroupRepository();
