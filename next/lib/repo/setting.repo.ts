import gql from "graphql-tag";
import { BaseModel, CrudRepository } from "./crud.repo";
import { SettingGroup } from "./setting-group.repo";

export interface Setting extends BaseModel {
  type: string;
  name: string;
  desc: string;
  key: string;
  value: any;
  isActive: boolean;
  isPrivate: boolean;
  isSecret: boolean;
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
    desc: String
    key: String
    value: Mixed
    isActive: Boolean
    isPrivate: Boolean
    isSecret: Boolean
    groupId: String
    createdAt: DateTime
    updatedAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    type: String
    name: String
    desc: String
    key: String
    value: Mixed
    isActive: Boolean
    isPrivate: Boolean
    isSecret: Boolean
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

export const SETTING_TYPES = [
  { value: "string", label: "Chữ" },
  { value: "number", label: "Số" },
  { value: "boolean", label: "Bật tắt" },
  { value: "image", label: "Hình ảnh" },
  { value: "array", label: "Mảng chữ" },
  { value: "richText", label: "Đoạn văn" },
  { value: "object", label: "Tuỳ chỉnh" },
];
