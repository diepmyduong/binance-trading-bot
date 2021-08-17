import { SettingResource } from "../resource";

const Type = SettingResource.Type;
export default {
  slug: "advanced",
  name: "Cấu hình nâng cao",
  settings: [
    {
      key: "ad-script",
      name: "Javascript Tuỳ chỉnh",
      type: Type.richText,
      isPrivate: true,
      value: "",
    },
    { key: "ad-css", name: "CSS Tuỳ Chỉnh", type: Type.richText, isPrivate: true, value: "" },
    {
      key: "ad-color-primary",
      name: "Theme Màu Primary",
      type: Type.string,
      isPrivate: true,
      value: "#0D57EF",
    },
    {
      key: "ad-color-accent",
      name: "Theme Màu Accent",
      type: Type.string,
      isPrivate: true,
      value: "38D0FF",
    },
  ],
} as SettingResource.ConfigSchema;
