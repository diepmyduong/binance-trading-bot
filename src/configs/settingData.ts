import { SettingType } from "../graphql/modules/setting/setting.model";

export enum SettingGroupSlug {
  CAU_HINH_CHUNG = "CAU_HINH_CHUNG",
}
export enum SettingKey {
  // CAU_HINH_CHUNG
  TITLE = "TITLE",
  LOGO = "LOGO",
  MAINTENANCE = "MAINTENANCE",
  SEO_TITLE = "SEO_TITLE",
  SEO_DESCRIPTION = "SEO_DESCRIPTION",
  SEO_IMAGE = "SEO_IMAGE",
  SCRIPT = "SCRIPT",
}

export const SETTING_DATA = [
  {
    slug: SettingGroupSlug.CAU_HINH_CHUNG,
    name: "Cấu hình chung",
    desc: "Các cấu hình chung",
    readOnly: true,
    settings: [
      {
        type: SettingType.string,
        name: "Tiêu đề ứng dụng",
        key: SettingKey.TITLE,
        value: `PShop`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "Logo ứng dụng",
        key: SettingKey.LOGO,
        value: `https://mb-ashop.web.app/assets/img/logo.png`,
        isActive: true,
        isPrivate: false,
        readOnly: false,
      },
      {
        type: SettingType.boolean,
        name: "Bảo trì hệ thống",
        key: SettingKey.MAINTENANCE,
        value: false,
        isActive: true,
        isPrivate: false,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "SEO: Tiêu đề",
        key: SettingKey.SEO_TITLE,
        value: "PShop",
        isActive: true,
        isPrivate: false,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "SEO: Mô tả",
        key: SettingKey.SEO_DESCRIPTION,
        value: "Cửa hàng PShop By VNPost",
        isActive: true,
        isPrivate: false,
        readOnly: false,
      },
      {
        type: SettingType.string,
        name: "SEO: Hình ảnh",
        key: SettingKey.SEO_IMAGE,
        value: "https://i.ibb.co/RCh1LhV/Screen-Shot-2021-05-18-at-14-08-33.png",
        isActive: true,
        isPrivate: false,
        readOnly: false,
      },
      {
        type: SettingType.richText,
        name: "Javascript Tuỳ Chỉnh",
        key: SettingKey.SCRIPT,
        value: `console.log('My script')`,
        isActive: true,
        isPrivate: true,
        readOnly: false,
      },
    ],
  },
];
