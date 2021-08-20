import mongoose from "mongoose";

import { BaseDocument, ModelLoader } from "../../../base/model";
import { MainConnection } from "../../../helpers/mongo";
import { SettingResource } from "./resource";

const Schema = mongoose.Schema;

export type ISetting = BaseDocument & {
  type?: SettingResource.Type;
  name?: string;
  desc?: string;
  key?: string;
  value?: any;
  isActive?: boolean;
  isPrivate?: boolean;
  isSecret?: boolean;
  groupId?: string;
  sort?: number;
};

const settingSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(SettingResource.Type),
      required: true,
      default: SettingResource.Type.string,
    },
    name: { type: String, required: true },
    desc: { type: String },
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isPrivate: { type: Boolean, required: true, default: false },
    isSecret: { type: Boolean, default: false },
    sort: { type: Number },
    groupId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, collation: { locale: "vi" } }
);

settingSchema.index({ key: 1 }, { unique: true });
settingSchema.index({ name: "text", key: "text" }, { weights: { name: 2, key: 4 } } as any);

export const SettingModel = MainConnection.model<ISetting>("Setting", settingSchema);
export const SettingLoader = ModelLoader<ISetting>(SettingModel);
