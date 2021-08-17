import { SettingResource } from "../resource";

const Type = SettingResource.Type;
export default {
  slug: "general",
  name: "Cấu hình chung",
  settings: [
    { key: "ge-title", name: "Tiêu đề ứng dụng", type: Type.string, value: "" },
    { key: "ge-logo", name: "Logo ứng dụng", type: Type.image, value: "" },
    { key: "ge-desc", name: "Mô tả ứng dụng", type: Type.string, value: "" },
    { key: "ge-cover", name: "Hình ảnh cover", type: Type.string, value: "" },
  ],
} as SettingResource.ConfigSchema;
