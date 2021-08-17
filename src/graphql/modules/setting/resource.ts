export namespace SettingResource {
  export enum Type {
    string = "string",
    number = "number",
    array = "array",
    object = "object",
    richText = "richText",
    boolean = "boolean",
    image = "image",
  }
  type ConfigSettingSchema = {
    key: string;
    name: string;
    desc?: string;
    type: Type;
    value: any;
    isActive?: boolean;
    isPrivate?: boolean;
    isSecret?: boolean;
  };
  export type ConfigSchema = {
    slug: string;
    name: string;
    desc?: string;
    settings: ConfigSettingSchema[];
  };
}
