import gql from "graphql-tag";
import { BaseModel, CrudRepository } from "./crud.repo";
import { SettingGroup } from "./setting-group.repo";

export interface Setting extends BaseModel {
  type: string;
  name: string;
  key: string;
  value: any;
  isActive: boolean;
  isPrivate: boolean;
  readOnly: boolean;
  groupId: string;
  group: SettingGroup;
}
export class SettingRepository extends CrudRepository<Setting> {
  apiName: string = "Setting";
  displayName: string = "cấu hình";
  shortFragment: string = this.parseFragment(`
    id: String
    type: String
    name: String
    key: String
    value: Mixed
    isActive: Boolean
    isPrivate: Boolean
    readOnly: Boolean
    groupId: String
    createdAt: DateTime
    updatedAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    type: String
    name: String
    key: String
    value: Mixed
    isActive: Boolean
    isPrivate: Boolean
    readOnly: Boolean
    groupId: String
    createdAt: DateTime
    updatedAt: DateTime
  `);

  async getSettingByKey(key: string) {
    console.log(`query { getOneSettingByKey(key: "${key}"){ ${this.fullFragment} } }`);
    const result = await this.apollo.query({
      query: gql`query { getOneSettingByKey(key: "${key}"){ ${this.fullFragment} } }`,
    });
    this.handleError(result);
    return result.data["getOneSettingByKey"] as Setting;
  }
}

export const SettingService = new SettingRepository();

export const SETTING_TYPES: Option[] = [
  { value: "string", label: "Chữ" },
  { value: "image", label: "Hình ảnh" },
  { value: "array", label: "Mảng chữ" },
  { value: "textarea", label: "Đoạn văn" },
  { value: "object", label: "Tuỳ chỉnh" },
];
